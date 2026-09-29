import type { DefaultSession } from "next-auth";
import type { Role } from "@/generated/prisma/client";

declare module "@auth/core/types" {
  interface User {
    role?: Role | null;
  }
  interface Session {
    user: { id: string; role: Role | null } & DefaultSession["user"];
  }
}