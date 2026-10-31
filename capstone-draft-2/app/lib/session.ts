// ------ REFERENCES
/** [1]
 * Description:
 * Reference: Vercel. (n.d.). headers. Next.js Documentation. https://nextjs.org/docs/app/api-reference/functions/headers
 */
/** [2]
 * Description:
 * Reference: Better Auth. (n.d.). API: Body, headers, query. https://better-auth.com/docs/concepts/api#body-headers-query
 */
/** [3]
 * Description:
 * Reference: Anthropic. (2026). Claude [Large language model]. https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d
 */
import { headers } from "next/headers";  //reads cookies from the request headers, so we can get the session cookie [1]
import { redirect } from "next/navigation";  // redirect user if not logged in on a page that requires authentication
import { auth } from "../lib/auth"; 

export async function getSession() {  //function gets session from request header, if no session returns null
  return auth.api.getSession({ headers: await headers() }); //[2]
}

export async function requireRole(role: "CONVENER" | "SPONSOR" | "MENTOR") { //checks if user has the required role, if not redirects to login page [3]
    const session = await getSession();
    if (!session) redirect("/login"); // if session is null redirect to login page
    if (session.user.role !== role) redirect("/"); // if user does not have the required role redirect to home page
    return session;
}
      