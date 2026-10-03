// https://claude.ai/share/1d1d6011-653c-428c-967a-144fbb8e5228
// includes aria labelling for accessibility (WCAG)

'use client'

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

type NavItem = { label: string; href: string}

const NAV_BAR_ITEMS: NavItem[] = [
    {label: 'Home', href: '/'},
    {label: 'Mentors', href: '/Mentors'},
    {label: 'Sponsors', href: '/Sponsors'},
    {label: 'Projects', href: '/Projects'},
    {label: 'Showcase', href: '/Showcase'},
]

//matches the highlighted page on the navbar to url path, why: all pages start with '/' so it checks for an exact match so if other 
//pages are visited the home page won't be highlighted 
//checks exact path of other pages incl. subpages
function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Navbar() {
  const pathname = usePathname() //create pathname variable from usePathname function which reads URL path to know what to render https://nextjs.org/docs/app/api-reference/functions/use-pathname
  const [open, setOpen] = useState(false) //https://react.dev/reference/react/useState , https://react.dev/learn/managing-state, checks state of selected navitem

  return (
    //TO-DO styling to match wireframes
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4"
      >
        {/* Logo / brand */}
        <Link href="/" className="text-lg font-semibold">
          MySite
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 md:flex">
          {NAV_BAR_ITEMS.map((item) => {  //loop over navitem list and creates list items for each to add to the navbar component
            const active = isActive(pathname, item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={
                    active
                      ? 'font-medium text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}