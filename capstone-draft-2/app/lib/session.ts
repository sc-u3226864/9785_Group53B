// ------ REFERENCES
/** [1]
 * Description: server-side calls to Better Auth need the request headers passed in so it can read the session cookie
 * Reference: Better Auth. (n.d.). API: Body, headers, query. https://better-auth.com/docs/concepts/api#body-headers-query
 */
/** [2]
 * Description: this prompt helped with setting these functions up, requireRole reads the role returned from getSession to confirm a users role, getSession calls the getSession betterauth api operation to get the role from the header
 * Reference: Anthropic. (2026). Claude [Large language model]. https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d
 */
import { headers } from "next/headers";  //reads cookies from the request headers, so we can get the session cookie
import { redirect } from "next/navigation";  // redirect user if not logged in on a page that requires authentication
import { auth } from "../lib/auth"; 

export async function getSession() {  //function gets session from request header, if no session returns null
  return auth.api.getSession({ headers: await headers() }); //[1]
}

export async function requireRole(role: "CONVENER" | "SPONSOR" | "MENTOR") { //checks if user has the required role, if not redirects [2]
    const session = await getSession();
    if (!session) redirect("/login"); // if session is null redirect to login page
    if (session.user.role !== role) redirect("/"); // if user does not have the required role redirect to home page
    return session;
}
      