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
    <nav className="shadow-md">
      <ul className="flex flex-row justify-center bg-[#00809f] text-white justify-evenly nav-bar-active">
        <Link className="nav-bar-select" href="/">Home</Link>
        <Link className="nav-bar-select" href="/mentors">Mentors</Link>
        <Link className="nav-bar-select" href="/sponsors">Sponsors</Link>
        <Link className="nav-bar-select" href="/projects">Projects</Link>
        <Link className="nav-bar-select" href="/showcase">Showcase</Link>
        {isConvener && <Link className="nav-bar-select" href="/dashboard">Dashboard</Link>} {/*only show dashboard link if user is convener*/}
        <Link className="nav-bar-select" href="/eoi">EOI</Link>
        {!isLoggedIn && <Link className="nav-bar-select" href="/login">Login</Link>}
        {isLoggedIn && <Link className="nav-bar-select" href="/" onClick={logout}>Logout</Link>}
      </ul>
    </nav>
  );
}