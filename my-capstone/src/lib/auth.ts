import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Database sessions: the role is re-read from the DB on every request,
  // so a convener's change applies immediately.
  session: { strategy: "database" },
  pages: { signIn: "/signin" },
  providers: [
    // Reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET automatically.
    // Email linking lets db:seed pre-create conveners; safe because Google verifies emails.
    Google({ allowDangerousEmailAccountLinking: true }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role ?? null;
      return session;
    },
  },
});