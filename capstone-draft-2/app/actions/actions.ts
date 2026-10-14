// ALL of the server action are in this file will seperate later

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";  //https://nextjs.org/docs/app/api-reference/functions/revalidatePath#usage after a server action which changes data this will be used to revalidate the page
import { z } from "zod";  //input validation library for forms https://zod.dev/
import { auth } from "../lib/auth";
import prisma from "../lib/prisma";
import { requireRole } from "../lib/session";


const setPasswordUrl = `${process.env.BETTER_AUTH_URL}/set-password`; //password reset url set in .env file
const text = (max: number) => z.string().trim().min(1).max(max);

// ---- authentication actions
export async function login(formData: FormData) { //login server action
    let role: string | undefined;
    try {  //validate the email and password with better_auth api if invalid it will throw an error
        const result = await auth.api.signInEmail({
            body: {email: String(formData.get("email")), password: String(formData.get("password"))}, //gets email and password from the form, if valid returns user object and sets a session cookie
        });
        role = result.user.role; //saves logged in user's role to redirect to the correct dashboard
    } catch { //if login fails redirect to login page with error message
        redirect("/login?error=1"); 
    }
    redirect("/")
}

export async function logout() {
  await auth.api.signOut({ headers: await headers() }); //https://better-auth.com/docs/basic-usage#signout
  redirect("/");
}

export async function sendPasswordLink(formData: FormData) {
  await auth.api.requestPasswordReset({            //doesn't send email just retunrs url for testing http://better-auth.com/docs/authentication/email-password#request-password-reset
    body: { email: String(formData.get("email")), redirectTo: setPasswordUrl },
  });
  redirect("/sign-in?linkSent=1");
}

export async function setPassword(formData: FormData) { //https://better-auth.com/docs/authentication/email-password#request-password-reset
  const token = String(formData.get("token"));
  try {
    await auth.api.resetPassword({ body: { token, newPassword: String(formData.get("password")) } });
  } catch {
    redirect(`/set-password?token=${encodeURIComponent(token)}&error=1`); //if token is invalid or expired sends back to setpassword page
  }
  redirect("/sign-in");
}

// ----- EOI form actions

export async function submitEOI(formData: FormData) {
    const data = z
        .object({
            role: z.enum(["SPONSOR", "MENTOR"]),
            name: z.string().trim().min(1).max(100), //TODO: change schema name to firstName and lastName
            email: z.string().toLowerCase().trim().max(100).pipe(z.email()),
            //TODO: add phone number
            organisation: z.string().trim().max(100).optional(),
            experience: z.string().trim().max(1000),
            phone: z.string().trim().max(20).optional(),
        })
        .parse(Object.fromEntries(formData)); //validate the form data with zod schema, if invalid it will throw an error
    await prisma.eOIForm.create({ data }); //save the form data to the database
    redirect("/eoi?sent=1"); //redirect to eoi submitted page
}

// ----- Convener actions
export async function approveEoi(formData: FormData) {
  await requireRole("CONVENER");                   //checks the logged in user is the convener
  const eoi = await prisma.eOIForm.findUniqueOrThrow({
    where: { id: String(formData.get("id")), status: "PENDING" }, //find eoi forms with status PENDING
  });

    // Both writes succeed together, or neither happens.
  await prisma.$transaction([ //ensures that multiple db operations are executed as a single unit of work, and rollback if any fail
    prisma.eOIForm.update({ where: { id: eoi.id, status: "PENDING" }, data: { status: "APPROVED" } }),
    prisma.user.create({  //create a new user with the eoi form data
      data: {
        name: eoi.name,
        email: eoi.email,
        role: eoi.role === "SPONSOR" ? "SPONSOR" : "MENTOR", // can never produce CONVENER
        organisation: eoi.organisation,
        experience: eoi.experience,
      },
    }),
  ]);

  // Send the set-password link after the transaction commits (an email can't be rolled back).
  await auth.api.requestPasswordReset({ body: { email: eoi.email, redirectTo: setPasswordUrl } });
  revalidatePath("/dashboard");
}

export async function deleteEoi(formData: FormData) { //deletes eoi form from the database
  await requireRole("CONVENER");
  await prisma.eOIForm.delete({ where: { id: String(formData.get("id")), status: "PENDING" } });
  revalidatePath("/dashboard");
}

export async function reviewProject(formData: FormData) { //review project server action so the convener can approve or reject a project
  await requireRole("CONVENER");
  const status = z.enum(["APPROVED", "REJECTED"]).parse(formData.get("status")); // from the clicked button
  await prisma.project.update({
    where: { id: String(formData.get("id")), status: "PENDING" },
    data: { status },
  });
  revalidatePath("/dashboard");
  revalidatePath("/projects");
}

export async function createShowcasePost(formData: FormData) { //create showcase post server action so the convener can create a showcase post
  const session = await requireRole("CONVENER");
  const data = z.object(
    { title: text(150), 
      semcompleted: z.string().trim().min(1).max(10),
      yearcompleted: z.string().trim().min(1).max(4),
      sponsor: text(100),
      mentor: text(100),
      organisation: text(100),
      student1: text(100),
      student2: text(100).optional(),
      student3: text(100).optional(),
      student4: text(100).optional(),
      description: z.string().trim().min(1).max(5000),
    }).parse(Object.fromEntries(formData));
  await prisma.showcasePost.create({ data: { ...data, authorId: session.user.id } }); // author from session
  revalidatePath("/showcase");
}

// ----- Sponsor actions

export async function createProject(formData: FormData) { //for sponsors to create a project submission
  const session = await requireRole("SPONSOR");
  const data = z.object(
    { 
      title: text(150), 
      description: text(5000), 
      scope: text(5000),
      skills: text(5000),
    })
    .parse(Object.fromEntries(formData));
  await prisma.project.create({ data: { ...data, sponsorId: session.user.id } }); // status defaults to PENDING
  redirect("/projects?submitted=1");
}