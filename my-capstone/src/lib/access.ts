import type { Role } from "@/generated/prisma/client";

/** Route prefixes that need specific roles. */
export const ROLE_ROUTES: { prefix: string; roles: readonly Role[] }[] = [
  { prefix: "/dashboard", roles: ["CONVENER"] },
  { prefix: "/projects", roles: ["STUDENT"] },
];

/** Route prefixes that only need a signed-in user (any role, or none). */
export const SIGNED_IN_ROUTES = ["/eoi"];

export function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function hasRole(role: Role | null | undefined, allowed: readonly Role[]) {
  return !!role && allowed.includes(role);
}