import { headers } from "next/headers";  //reads cookies from the request headers, so we can get the session cookie https://nextjs.org/docs/app/api-reference/functions/headers
import { redirect } from "next/navigation";  // redirect user if not logged in on a page that requires authentication
import { auth } from "../lib/auth"; 

export async function getSession() {  //function gets session from request header, if no session returns null
  return auth.api.getSession({ headers: await headers() }); //https://better-auth.com/docs/concepts/api  & https://better-auth.com/docs/concepts/session-management#get-session
}

export async function requireRole(role: "CONVENER" | "SPONSOR" | "MENTOR") { //checks if user has the required role, if not redirects to login page
    const session = await getSession();
    if (!session) redirect("/login"); // if session is null redirect to login page
    if (session.user.role !== role) redirect("/"); // if user does not have the required role redirect to home page
    return session;
}
      