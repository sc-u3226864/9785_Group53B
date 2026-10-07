//setting up better_auth client https://better-auth.com/docs/installation
//https://better-auth.com/docs/authentication/email-password#configuration

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { hashPassword, verifyPassword } from "./password";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: { 
    enabled: true, 
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  }, 
});