// https://claude.ai/share/1d1d6011-653c-428c-967a-144fbb8e5228
// includes aria labelling for accessibility (WCAG)

'use server'

import Link from "next/link"
import { getSession } from "../lib/session"
import {logout} from "../actions/actions"

export async function Navbar() {
  const session = await getSession();
  const isConvener = session?.user.role === "CONVENER"; //checks if user is convener to show dashboard link
  const isLoggedIn = !!session; //checks if user is logged in to show login link
  return (
    <nav>
      <ul>
        <Link href="/">Home</Link>
        <Link href="/mentors">Mentors</Link>
        <Link href="/sponsors">Sponsors</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/showcase">Showcase</Link>
        {isConvener && <Link href="/dashboard">Dashboard</Link>} {/*only show dashboard link if user is convener*/}
        <Link href="/eoi">EOI</Link>
        {!isLoggedIn && <Link href="/login">Login</Link>}
        {isLoggedIn && <Link href="/" onClick={logout}>Logout</Link>}
      </ul>
    </nav>
  );
}