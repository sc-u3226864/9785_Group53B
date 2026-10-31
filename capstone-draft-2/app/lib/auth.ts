// ------ REFERENCES
/** [1]
 * Description: setting up better_auth client
 * Reference: Better Auth. (n.d.). Installation. https://better-auth.com/docs/installation
 */
/** [2]
 * Description:
 * Reference: Better Auth. (n.d.). Email & password: Configuration. https://better-auth.com/docs/authentication/email-password#configuration
 */
/** [3]
 * Description:
 * Reference: Better Auth. (n.d.). Email & password: Request password reset. https://better-auth.com/docs/authentication/email-password#request-password-reset
 */
/** [4]
 * Description:
 * Reference: Better Auth. (n.d.). Next.js integration: Server action cookies. https://better-auth.com/docs/integrations/next#server-action-cookies
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../lib/prisma";   //one shared prisma client to avoid multiple connections
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({ //[1]
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: { //[2]
    enabled: true, 
    disableSignup: true, //account creation is from eoi form approval, no public signup
    resetPasswordTokenExpiresIn: 60 * 60 * 24, //24 hour reset password token expiration
    sendResetPassword: async ({user, url}) => //[3]
      {console.log(`Reset password email sent to ${user.email} with url: ${url}`);}, //TODO: this is for local testing, in prod we suggest setting it up with Resend
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

  plugins: [nextCookies()],    //so the browser can store the session [4]
});