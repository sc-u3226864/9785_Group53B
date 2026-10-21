//setting up better_auth client https://better-auth.com/docs/installation
//https://better-auth.com/docs/authentication/email-password#configuration

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../lib/prisma";   //one shared prisma client to avoid multiple connections
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true, 
    disableSignup: true, //account creation is from eoi form approval, no public signup
    resetPasswordTokenExpiresIn: 60 * 60 * 24, //24 hour reset password token expiration
    sendResetPassword: async ({user, url}) => 
      {console.log(`Reset password email sent to ${user.email} with url: ${url}`);}, //for testing, in prod we'll set it up with Resend
  }, 
  user: {
    additionalFields: {
      role: {type: "string", input: false},    //so the client can't set thier own role, set on server side
    
    
    }
  },

  session: {  //using the session cookie so page doesn't have to query the database on every getSession() request when checking role, only every 5 minutes
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // re-check the database every 5 minutes
    },
  },

  plugins: [nextCookies()],    //https://better-auth.com/docs/integrations/next#server-action-cookies , so the browser can store the session
});