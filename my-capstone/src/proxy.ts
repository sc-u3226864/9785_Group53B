import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ROLE_ROUTES, hasRole, matchesPrefix } from "@/lib/access";

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const user = req.auth?.user;

  // Every matched route needs a session.
  if (!user) {
    const url = new URL("/signin", req.nextUrl);
    url.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(url);
  }

  const rule = ROLE_ROUTES.find((r) => matchesPrefix(pathname, r.prefix));
  if (rule && !hasRole(user.role, rule.roles)) {
    return NextResponse.redirect(new URL("/unauthorised", req.nextUrl));
  }

  return NextResponse.next();
});

// Only run on protected routes, so public pages don't pay for a session lookup.
export const config = {
  matcher: ["/dashboard/:path*", "/projects/:path*", "/eoi/:path*"],
};