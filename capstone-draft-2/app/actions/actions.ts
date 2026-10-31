// ------ REFERENCES
/** [1]
 * Description: This prompt gave me a lot of reusable code which I was able to learn from and reapply
 * to other pages to build functionality with. It helped a lot with role access, better auth authentication setup, actions, prisma api operation, and page setup
 * Reference: Anthropic. (2026). Claude [Large language model]. https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d
 */
/** [2]
 * Description: This was used after CRUD operations to update any changed pages
 * Reference: Vercel. (n.d.). revalidatePath. Next.js Documentation. https://nextjs.org/docs/app/api-reference/functions/revalidatePath#usage
 */
/** [3]
 * Description: Zod was used in the server actions to validate inputs. This ensures form inputs are type-safe
 * Reference: Zod. (n.d.). Intro. https://zod.dev/
 */
/** [4]
 * Description: FormData is a web API used to collect html form inputs and pass them as key value pairs. In this project it's used in functions to collect/manipulate data before it's committed to the db
 * Reference: MDN Contributors. (n.d.). FormData. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/FormData
 */
/** [5]
 * Description: The steps outlined in this documentation was used to setup the email and password authentication. It provided a range of functions used in this assignment such as sign-out, sign-in, password reset etc.
 * Reference: Better Auth. (n.d.). Email & password: Sign out. https://better-auth.com/docs/authentication/email-password#sign-out
 */
/** [6]
 * Description: ^ same as above , this function was used for requesting a password reset
 * Reference: Better Auth. (n.d.). Email & password: Request password reset. https://better-auth.com/docs/authentication/email-password#request-password-reset
 */
/** [7]
 * Description: This turns the sign in token into a format safe for URL's
 * Reference: MDN Contributors. (n.d.). encodeURIComponent(). MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 */
/** [8]
 * Description: This helped with creating the file upload functionality in the EOI form, it was also adapted for image upload in showcase, mentor and sponsor posts
 * Reference: Chandan. (2026, March 25). File uploads in Next.js (complete guide with server actions). CodeToDeploy. Medium. https://medium.com/codetodeploy/file-uploads-in-next-js-complete-guide-with-server-actions-83a5ad4ece5b
 */
/** [9]
 * Description: the File API was used to get metadata from a file upload e.g. file.type returns the extension of the file thats uploaded in our forms
 * Reference: MDN Contributors. (n.d.). File. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/File
 */
/** [10]
 * Description: Promises are used for asynchronous actions throughout the functions. It ensures that the program doesn't halt when a function that takes a long time is reliant on another, e.g. API calls to the DB can be slow so providing a promise means the function can continue while the call is happening in the background
 * Reference: Mimo. (n.d.). TypeScript promise: Syntax, usage, and examples. https://mimo.org/glossary/typescript/promise
 */
/** [11]
 * Description: Buffers are used for temporary storage on the server memory when a file is being uploaded and help with handling raw binary data like images and pdf's. It's used in this project for turning the file and image uploads into a buffer and then writes them to the directory
 * Reference: Devcode Hunter. (2024, September 12). Mastering buffers in Node.js: A complete guide with examples. Medium. https://medium.com/@devcodehunter/mastering-buffers-in-node-js-a-complete-guide-with-examples-e8e6f8e07408
 */
/** [12]
 * Description: used for getting specific fields, or FormData keys, on the submitted form
 * Reference: MDN Contributors. (n.d.). FormData: get() method. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/FormData/get
 */
/** [13]
 * Description: transactions ensure that when multiple data operations are run together, if one of them fails, the whole block will roll back
 * Reference: Prisma. (n.d.). Transactions in Prisma ORM. Prisma Documentation. https://www.prisma.io/docs/orm/fundamentals/transactions
 */
/** [14]
 * Description: prisma client API operation used to update entries in the database
 * Reference: Prisma. (n.d.). Prisma Client API (Prisma ORM v7): update. Prisma Documentation. https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#update
 */
/** [15]
 * Description: prisma client API operation used to update entries in the database
 * Reference: Prisma. (n.d.). Prisma Client API (Prisma ORM v7): create. Prisma Documentation. https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#create
 */
/** [16]
 * Description: This wasn't used but was investigated for deleting files from the directory following a deletion of the record from the database
 * Reference: GeeksforGeeks. (2021, February 1). Node.js fs.rm() method. https://www.geeksforgeeks.org/node-js/node-js-fs-rm-method/
 */

"use server"; //[1]

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";  //after a server action which changes data this will be used to revalidate the page [2]
import { z } from "zod";  //input validation library for forms [3]
import { auth } from "../lib/auth"; 
import prisma from "../lib/prisma";
import { requireRole } from "../lib/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

// ------ CONSTANTS
const setPasswordUrl = `${process.env.BETTER_AUTH_URL}/set-password`; //password reset url set in .env file (BETTER_AUTH_URL)
const defaultImage = "/images/pfp_default.jpg"; //used for the default profile pics for sponsor and mentor posts
const maxSize = 5 * 1024 * 1024; // 5 MB
const text = (max: number) => z.string().trim().min(1).max(max);

// ------ AUTHENTICATION ACTIONS
export async function login(formData: FormData) { //login server action, FormData explanation [4]
    let role: string | undefined;
    try {  //validate the email and password with better_auth api if invalid it will throw an error
        const result = await auth.api.signInEmail({
            body: {email: String(formData.get("email")), password: String(formData.get("password"))}, //gets email and password from the form, if valid returns user object and sets a session cookie
        });
        role = result.user.role; //saves logged in user's role to redirect to the correct dashboard
    } catch { //if login fails redirect to login page with error message
        redirect("/login?error=1"); 
    }
    redirect(role === "CONVENER" ? "/dashboard" : "/")
}

export async function logout() {
  await auth.api.signOut({ headers: await headers() }); //[5]
  redirect("/");
}

export async function sendPasswordLink(formData: FormData) {
  await auth.api.requestPasswordReset({            //doesn't send email just retunrs url for testing [6]
    body: { email: String(formData.get("email")), redirectTo: setPasswordUrl },
  });
  redirect("/login?linkSent=1");
}

export async function setPassword(formData: FormData) { //[6]
  const token = String(formData.get("token"));
  try {
    await auth.api.resetPassword({ body: { token, newPassword: String(formData.get("password")) } });
  } catch {
    redirect(`/set-password?token=${encodeURIComponent(token)}&error=1`); //if token is invalid or expired sends back to setpassword page
  } // convert a text string into a URL-safe format [7]
  redirect("/login");
}

// ------ EOI FORM ACTIONS
// File interface information used to get information from a file upload [9]
// Promises: promises are used to give the result of an asynchonous operation [10]
export async function saveFile(file: File): Promise<string> { //this function is used for the CV file upload in the submitEOI function [8]
  if (!file.type.startsWith("application/")) throw new Error("Must be a document"); //check file type and size
  if (file.size > maxSize) throw new Error("File too large (max 5 MB)");

  const ext = { "application/pdf": ".pdf", "application/msword": ".doc", "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx" }[file.type]; //must be one of these three types, if not throw error
  if (!ext) throw new Error("Unsupported document type");
  const filename = `${crypto.randomUUID()}${ext}`; //generate a random filename for the document to avoid conflicts
  const dir = path.join(process.cwd(), "public", "cvs"); //saves document at public/uploads

  await mkdir(dir, { recursive: true }); //create the uploads directory if it doesn't exist, no error if it does exist
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer())); //write the file to the public/cvs directory, convert the file to a buffer from an array buffer [11]

  return `/cvs/${filename}`;
}

export async function submitEOI(formData: FormData) { //used to create eoi form entry in db
  const file = formData.get("file"); //this is a XMLHttpRequest API method [12]
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Please upload your CV.");
  }
    const data = z
        .object({
            role: z.enum(["SPONSOR", "MENTOR"]),
            name: text(100), //TODO: change schema name to firstName and lastName
            email: z.string().toLowerCase().trim().max(100).pipe(z.email()),
            organisation: text(100).optional(),
            experience: text(5000),
            phone: z.string().max(20).optional(),
        })
        .parse(Object.fromEntries(formData)); //validate the form data with zod schema, if invalid it will throw an error
        const cvfile = await saveFile(file); //await used to settle the promise used in saveFile
    await prisma.eOIForm.create({ data: { ...data, cvfile } }); //save the form data to the database
    redirect("/eoi?sent=1"); //redirect to eoi submitted page
}

// ------ CONVENER ACTIONS
export async function approveEoi(formData: FormData) { //used to change eoi form entry to APPROVED, create user from eoi form, and reset new user password with betterauth client & api
  await requireRole("CONVENER");                   //checks the logged in user is the convener
  const eoi = await prisma.eOIForm.findUniqueOrThrow({
    where: { id: String(formData.get("id")), status: "PENDING" }, //find eoi forms with status PENDING
  });

    // Both writes succeed together, or neither happens. [13]
  await prisma.$transaction([ //ensures that multiple db operations are executed as a single unit of work, and rollback if any fail
    prisma.eOIForm.update({ where: { id: eoi.id, status: "PENDING" }, data: { status: "APPROVED" } }), //[14]
    prisma.user.create({  //create a new user with the eoi form data [15]
      data: {
        name: eoi.name,
        email: eoi.email,
        role: eoi.role === "SPONSOR" ? "SPONSOR" : "MENTOR", // can never produce CONVENER
        organisation: eoi.organisation,
        experience: eoi.experience,
        phone: eoi.phone,
      },
    }),
  ]);

  // Send the set-password link after the transaction commits (an email can't be rolled back). [6]
  await auth.api.requestPasswordReset({ body: { email: eoi.email, redirectTo: setPasswordUrl } });
  revalidatePath("/dashboard");
}

export async function deleteEoi(formData: FormData) { //deletes eoi form from the database
  await requireRole("CONVENER");
  await prisma.eOIForm.delete({ where: { id: String(formData.get("id")), status: "PENDING" } }); 
  revalidatePath("/dashboard");
}

export async function reviewProject(formData: FormData) { //review project action so the convener can approve or reject a project
  await requireRole("CONVENER");
  const status = z.enum(["APPROVED", "REJECTED"]).parse(formData.get("status")); // from the clicked button
  await prisma.project.update({
    where: { id: String(formData.get("id")), status: "PENDING" },
    data: { status },
  });
  revalidatePath("/dashboard");
  revalidatePath("/projects");
}

// ------ SHOWCASE ACTIONS
async function saveShowcaseImage(file: File): Promise<string> { 
  if (!file.type.startsWith("image/")) throw new Error("File must be an image"); //check file type and size
  if (file.size > maxSize) throw new Error("Image too large (max 5 MB)");

  const ext = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" }[file.type]; //uses dict lookup to match file type to extention, must be one of these three types, if not throw error
  if (!ext) throw new Error("Unsupported image type");
  const filename = `${crypto.randomUUID()}${ext}`; //generate a random filename for the image to avoid conflicts
  const dir = path.join(process.cwd(), "public", "showcase"); //saves image at public/showcase

  await mkdir(dir, { recursive: true }); //create the uploads directory if it doesn't exist, no error if it does exist
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer())); //write the file to the uploads directory, convert the file to a buffer from an array buffer [11]

  return `/showcase/${filename}`;
}

async function readShowcasePost (formData: FormData , existingImageURL: string | null = null,) { //used to collect form data for new posts and editing posts
  const title = String(formData.get("title") ?? "").trim(); //grabs the form entries and clears trailing whitespace, if empty adds empty string
  const semCompleted = String(formData.get("semCompleted") ?? "").trim(); 
  const yearCompleted = String(formData.get("yearCompleted") ?? "").trim(); 
  const sponsor = String(formData.get("sponsor") ?? "").trim(); 
  const mentor = String(formData.get("mentor") ?? "").trim(); 
  const organisation = String(formData.get("organisation") ?? "").trim();
  const student1 = String(formData.get("student1") ?? "").trim();
  const student2 = String(formData.get("student2") ?? "").trim();
  const student3 = String(formData.get("student3") ?? "").trim();
  const student4 = String(formData.get("student4") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title) throw new Error("Title is required.");  //manual error handling if no title or description is submitted
  if (!description) throw new Error("Description is required.");

  const file = formData.get("showcaseImage");
  const showcaseImageURL =
    file instanceof File && file.size > 0 //if no file uploaded run saveShowcaseImage, otherwise use existing image
      ? await saveShowcaseImage(file)
      : existingImageURL;

  return { //returns the form data as an object for prisma, null for emty values so there's no error
    title,
    semcompleted: semCompleted,
    yearcompleted: yearCompleted,
    sponsor,
    mentor,
    organisation: organisation || null,
    student1,
    student2: student2 || null,
    student3: student3 || null,
    student4: student4 || null,
    description,
    showcaseImageURL, 
  };
}

export async function createShowcasePost(formData: FormData) { 
  const session = await requireRole("CONVENER");
  const data = await readShowcasePost(formData);   //reads the form data from readShowcasePost and returns an object for prisma
  await prisma.showcasePost.create({
    data: { ...data, author: { connect: { id: session.user.id } } },
  });
  revalidatePath("/showcase");  //revalidates the showcase page so the new post is displayed
  revalidatePath("/"); //so carousel updates
  redirect("/showcase");
}

export async function updateShowcasePost(formData: FormData) { 
  await requireRole("CONVENER");
  const id = String(formData.get("id") ?? ""); //grabs the id of the post to be updated
  const post = await prisma.showcasePost.findUniqueOrThrow({ where: { id } });
  const data = await readShowcasePost(formData, post.showcaseImageURL);  //reads the form data and returns an object for prisma at that id
  await prisma.showcasePost.update({ where: { id }, data });
  revalidatePath("/showcase");
  redirect("/showcase");
}

//TODO: delete files from directory [16]
export async function deleteShowcasePost(formData: FormData) { 
  await requireRole("CONVENER");
  const id = String(formData.get("id") ?? "");
  await prisma.showcasePost.delete({ where: { id } });
  revalidatePath("/showcase");
}

// ------ SPONSOR ACTIONS
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

export async function deleteProjectPost(formData: FormData) { //convener delete form
  await requireRole("CONVENER");
  const id = String(formData.get("id") ?? "");
  await prisma.project.delete({ where: { id } });
  revalidatePath("/project");
}

// ------ MENTOR POST ACTIONS

async function readMentorForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim(); //grabs the form entries and clears trailing whitespace, if empty adds empty string
  const email = String(formData.get("email") ?? "").trim(); 
  const phone = String(formData.get("phone") ?? "").trim(); 
  const experience = String(formData.get("experience") ?? "").trim();

  if (!name) throw new Error("Name is required.");  //manual error handling if no name or experience is submitted
  if (!experience) throw new Error("Experience is required.");

  const file = formData.get("image");
  const existing = String(formData.get("existingImageURL") ?? ""); //carries the image that the post already has, so when editing it doesn't wipe the old one
  const imageURL =
    file instanceof File && file.size > 0 //the imageURL is either the new image that was uploaded, or the existing image if no new image was uploaded, or the default image if no image was uploaded and there is no existing image
      ? await saveImage(file)
      : existing || defaultImage;

  return { //returns the form data as an object for prisma, null for emty values so there's no error
    name,
    experience,
    email: email || null,
    phone: phone || null,
    imageURL,
  };
}

export async function createMentorPost(formData: FormData) { 
  await requireRole("CONVENER");
  const data = await readMentorForm(formData);   //reads the form data and returns an object for prisma
  await prisma.mentorPost.create({ data });
  revalidatePath("/mentors");  //revalidates the mentors page so the new post is displayed
  redirect("/mentors");
}

export async function updateMentorPost(formData: FormData) { 
  await requireRole("CONVENER");
  const id = String(formData.get("id") ?? ""); //grabs the id of the post to be updated
  const data = await readMentorForm(formData);  //reads the form data and returns an object for prisma at that id
  await prisma.mentorPost.update({ where: { id }, data });
  revalidatePath("/mentors");
  redirect("/mentors");
}

export async function deleteMentorPost(formData: FormData) { 
  await requireRole("CONVENER");
  const id = String(formData.get("id") ?? "");
  await prisma.mentorPost.delete({ where: { id } });
  revalidatePath("/mentors");
}

//this function is reused for the sponsor post actions
async function saveImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("File must be an image"); //check file type and size
  if (file.size > maxSize) throw new Error("Image too large (max 5 MB)");

  const ext = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" }[file.type]; //must be one of these three types, if not throw error
  if (!ext) throw new Error("Unsupported image type");
  const filename = `${crypto.randomUUID()}${ext}`; //generate a random filename for the image to avoid conflicts
  const dir = path.join(process.cwd(), "public", "uploads"); //saves image at public/uploads

  await mkdir(dir, { recursive: true }); //create the uploads directory if it doesn't exist, no error if it does exist
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer())); //write the file to the uploads directory, convert the file to a buffer from an array buffer [11]

  return `/uploads/${filename}`;
}


// ------ SPONSOR POST ACTIONS

async function readSponsorForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim(); //grabs the form entries and clears trailing whitespace, if empty adds empty string
  const email = String(formData.get("email") ?? "").trim(); 
  const phone = String(formData.get("phone") ?? "").trim(); 
  const organisation = String(formData.get("organisation") ?? "").trim();
  const experience = String(formData.get("experience") ?? "").trim();

  if (!name) throw new Error("Name is required.");  //manual error handling if no name or experience is submitted
  if (!experience) throw new Error("Experience is required.");

  const file = formData.get("image");
  const existing = String(formData.get("existingImageURL") ?? ""); //carries the image that the post already has, so when editing it doesn't wipe the old one
  const imageURL =
    file instanceof File && file.size > 0 //the imageURL is either the new image that was uploaded, or the existing image if no new image was uploaded, or the default image if no image was uploaded and there is no existing image
      ? await saveImage(file)
      : existing || defaultImage;

  return { //returns the form data as an object for prisma, null for emty values so there's no error
    name,
    experience,
    email: email || null,
    phone: phone || null,
    organisation: organisation,
    imageURL,
  };
}

export async function createSponsorPost(formData: FormData) { 
  await requireRole("CONVENER");
  const data = await readSponsorForm(formData);   //reads the form data and returns an object for prisma
  await prisma.sponsorPost.create({ data });
  revalidatePath("/sponsors");  //revalidates the sponsors page so the new post is displayed
  redirect("/sponsors");
}

export async function updateSponsorPost(formData: FormData) { 
  await requireRole("CONVENER");
  const id = String(formData.get("id") ?? ""); //grabs the id of the post to be updated
  const data = await readSponsorForm(formData);  //reads the form data and returns an object for prisma at that id
  await prisma.sponsorPost.update({ where: { id }, data });
  revalidatePath("/sponsors");
  redirect("/sponsors");
}

export async function deleteSponsorPost(formData: FormData) { 
  await requireRole("CONVENER");
  const id = String(formData.get("id") ?? "");
  await prisma.sponsorPost.delete({ where: { id } });
  revalidatePath("/sponsors");
}



