"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/authz";
import type { ActionState } from "@/lib/action-state";

const setRoleSchema = z.object({
  userId: z.string().min(1),
  // Conveners can't create other conveners from the UI; use the seed for that.
  role: z.enum(["STUDENT", "MENTOR", "SPONSOR"]),
});

export async function setUserRole(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await authorize(["CONVENER"]);
  if (!auth.ok) return { status: "error", message: auth.error };

  const parsed = setRoleSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { status: "error", message: "Pick a valid role." };
  const { userId, role } = parsed.data;

  // Guarded update: only users who don't have a role yet.
  const updated = await prisma.user.updateMany({
    where: { id: userId, role: null },
    data: { role },
  });
  if (updated.count === 0) return { status: "error", message: "That user already has a role." };

  revalidatePath("/dashboard");
  return { status: "success", message: `Role set to ${role.toLowerCase()}.` };
}