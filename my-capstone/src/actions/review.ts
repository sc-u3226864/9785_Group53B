"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/authz";
import { reviewEoiSchema } from "@/lib/validation/eoi";
import type { ActionState } from "@/lib/action-state";

/** Expected, user-facing failures thrown inside the transaction. */
class ReviewError extends Error {}

export async function reviewEoi(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await authorize(["CONVENER"]);
  if (!auth.ok) return { status: "error", message: auth.error };
  const reviewer = auth.user;

  const parsed = reviewEoiSchema.safeParse({
    eoiId: formData.get("eoiId"),
    decision: formData.get("decision"),
    projectId: formData.get("projectId"),
    reviewNote: formData.get("reviewNote"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Invalid review.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const { eoiId, decision, projectId: chosenProjectId, reviewNote } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      const eoi = await tx.eoi.findUnique({
        where: { id: eoiId },
        include: { applicant: { select: { id: true, role: true } } },
      });
      if (!eoi) throw new ReviewError("EOI not found.");

      // For approvals, work out and check the target project first.
      let projectId: string | null = null;
      if (decision === "APPROVE") {
        projectId = eoi.type === "STUDENT" ? eoi.projectId : chosenProjectId ?? null;
        if (!projectId) {
          throw new ReviewError("Choose a project to assign this mentor/sponsor to.");
        }

        const project = await tx.project.findUnique({
          where: { id: projectId },
          select: {
            capacity: true,
            _count: { select: { assignments: { where: { type: "STUDENT" } } } },
          },
        });
        if (!project) throw new ReviewError("Project not found.");
        if (
          eoi.type === "STUDENT" &&
          project.capacity !== null &&
          project._count.assignments >= project.capacity
        ) {
          throw new ReviewError("That project is already at capacity.");
        }

        // One role per user: don't overwrite a different existing role.
        const current = eoi.applicant.role;
        if (current && current !== eoi.type) {
          throw new ReviewError(`This user already has the ${current} role.`);
        }
      }

      // Guarded update: only succeeds if still PENDING (stops double-reviews).
      const updated = await tx.eoi.updateMany({
        where: { id: eoiId, status: "PENDING" },
        data: {
          status: decision === "APPROVE" ? "APPROVED" : "REJECTED",
          reviewedById: reviewer.id,
          reviewedAt: new Date(),
          reviewNote,
        },
      });
      if (updated.count === 0) throw new ReviewError("This EOI has already been reviewed.");

      if (decision === "REJECT" || !projectId) return;

      if (!eoi.applicant.role) {
        await tx.user.update({ where: { id: eoi.applicantId }, data: { role: eoi.type } });
      }

      await tx.projectAssignment.upsert({
        where: { userId_projectId: { userId: eoi.applicantId, projectId } },
        create: { userId: eoi.applicantId, projectId, type: eoi.type, eoiId: eoi.id },
        update: {},
      });

      // A student can only be placed once, so close their other pending EOIs.
      if (eoi.type === "STUDENT") {
        await tx.eoi.updateMany({
          where: {
            applicantId: eoi.applicantId,
            type: "STUDENT",
            status: "PENDING",
            id: { not: eoi.id },
          },
          data: {
            status: "REJECTED",
            reviewedById: reviewer.id,
            reviewedAt: new Date(),
            reviewNote: "Closed automatically: placed in another project.",
          },
        });
      }
    });
  } catch (err) {
    if (err instanceof ReviewError) return { status: "error", message: err.message };
    throw err; // unexpected: let error.tsx handle it
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath("/projects");

  return {
    status: "success",
    message: decision === "APPROVE" ? "EOI approved and user assigned." : "EOI rejected.",
  };
}