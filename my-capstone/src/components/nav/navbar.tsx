import Link from "next/link";
import type { Role } from "@/generated/prisma/client";
import { signIn, signOut } from "@/lib/auth";
import { getCurrentUser } from "@/lib/authz";
import { NavLink } from "./nav-link";

type NavItem = { href: string; label: string; roles?: readonly Role[]; signedInOnly?: boolean };

// Visibility here is a UX convenience only; pages and actions enforce access.
const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/showcase", label: "Showcase" },
  { href: "/projects", label: "Projects", roles: ["STUDENT"] },
  { href: "/dashboard", label: "Dashboard", roles: ["CONVENER"] },
];

export async function Navbar() {
  const user = await getCurrentUser();

  const items = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return !!user?.role && item.roles.includes(user.role);
  });

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <Link href="/" className="font-semibold">Uni Projects</Link>

        <ul className="flex gap-4 text-sm">
          {items.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href}>{item.label}</NavLink>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="hidden text-zinc-600 sm:inline">
                {user.name ?? user.email}
                {user.role && (
                  <span className="ml-2 rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
                    {user.role.toLowerCase()}
                  </span>
                )}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="rounded-md border px-3 py-1.5 hover:bg-zinc-50">Sign out</button>
              </form>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
              }}
            >
              <button className="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-700">
                Sign in
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
}