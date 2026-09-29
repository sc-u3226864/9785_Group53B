"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/authz";
import { studentEoiSchema } from "@/lib/validation/eoi";
import type { ActionState } from "@/lib/action-state";

export async function submitStudentEoi(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // 1. Authorise
  const auth = await authorize(["STUDENT"]);
  if (!auth.ok) return { status: "error", message: auth.error };
  const { user } = auth;

  // 2. Validate input
  const parsed = studentEoiSchema.safeParse({
    projectId: formData.get("projectId"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const { projectId, message } = parsed.data;

  // 3. Business rules (never trust the hidden projectId)
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { status: true },
  });
  if (!project || project.status !== "PUBLISHED") {
    return { status: "error", message: "This project isn't open for EOIs." };
  }

  const alreadyPlaced = await prisma.projectAssignment.findFirst({
    where: { userId: user.id, type: "STUDENT" },
    select: { id: true },
  });
  if (alreadyPlaced) {
    return { status: "error", message: "You're already assigned to a project." };
  }

  const duplicate = await prisma.eoi.findFirst({
    where: { applicantId: user.id, projectId, status: { in: ["PENDING", "APPROVED"] } },
    select: { id: true },
  });
  if (duplicate) {
    return { status: "error", message: "You've already submitted an EOI for this project." };
  }

  // 4. Write
  await prisma.eoi.create({
    data: { type: "STUDENT", applicantId: user.id, projectId, message },
  });

  // 5. Refresh affected pages
  revalidatePath("/projects");
  revalidatePath("/dashboard");

  return { status: "success", message: "EOI submitted. A convener will review it soon." };
}

import { getCurrentUser } from "@/lib/authz";
import { partnerEoiSchema } from "@/lib/validation/eoi";

export async function submitPartnerEoi(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Any signed-in user can apply; no role needed yet.
  const user = await getCurrentUser();
  if (!user) return { status: "error", message: "You need to sign in first." };

  const parsed = partnerEoiSchema.safeParse({
    type: formData.get("type"),
    organisation: formData.get("organisation"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const { type, organisation, message } = parsed.data;

  if (user.role && user.role !== type) {
    return { status: "error", message: `Your account already has the ${user.role.toLowerCase()} role.` };
  }

  const pending = await prisma.eoi.findFirst({
    where: { applicantId: user.id, type, status: "PENDING" },
    select: { id: true },
  });
  if (pending) return { status: "error", message: "You already have an EOI awaiting review." };

  await prisma.eoi.create({ data: { type, applicantId: user.id, organisation, message } });

  revalidatePath("/dashboard");
  return { status: "success", message: "EOI submitted. A convener will review it soon." };
}