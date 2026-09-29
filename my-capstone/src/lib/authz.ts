import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Role } from "@/generated/prisma/client";
import { hasRole } from "@/lib/access";

/** Session user, de-duplicated per request (navbar + page won't double-fetch). */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});

/** For pages: redirect to sign-in if there's no session. */
export async function requireUser(callbackUrl?: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(
      callbackUrl
        ? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : "/signin",
    );
  }
  return user;
}

/**
 * For pages: require one of `roles`, otherwise redirect.
 * Usage: const user = await requireRole(["CONVENER"]);
 */
export async function requireRole(
  roles: readonly Role[],
  opts: { callbackUrl?: string } = {},
) {
  const user = await requireUser(opts.callbackUrl);
  if (!hasRole(user.role, roles)) redirect("/unauthorised");
  return { ...user, role: user.role as Role };
}

/**
 * For server actions: returns a result instead of redirecting,
 * so the form can show a message.
 */
export async function authorize(roles: readonly Role[]) {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false as const, error: "You need to sign in first." };
  }
  if (!hasRole(user.role, roles)) {
    return { ok: false as const, error: "You don't have permission to do that." };
  }
  return { ok: true as const, user: { ...user, role: user.role as Role } };
}