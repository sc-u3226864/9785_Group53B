# 04 · Frontend development: building pages and features

This guide explains how pages, navigation and data flow work in this app, then walks through building a complete feature.

> **Next.js 16 is newer than most tutorials.** Some APIs changed; for example, middleware is now `src/proxy.ts`, and `error.tsx` receives `retry` instead of `reset`. When in doubt, check the docs that ship with the installed version in `my-capstone/node_modules/next/dist/docs/` (as `my-capstone/AGENTS.md` says), or <https://nextjs.org/docs>.

## Contents
1. [How routing works here](#1-how-routing-works-here)
2. [Layouts and navigation](#2-layouts-and-navigation)
3. [How the frontend talks to the backend](#3-how-the-frontend-talks-to-the-backend)
4. [Worked example: a "Manage projects" page](#4-worked-example-a-manage-projects-page)
5. [Where things live, and conventions](#5-where-things-live-and-conventions)
6. [Loading states, errors and protected pages](#6-loading-states-errors-and-protected-pages)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. How routing works here

We use the **App Router**: **folders inside `src/app/` become URLs**, and a `page.tsx` file makes that folder a visitable page.

```
my-capstone/src/app/
├── layout.tsx                  ← wraps EVERY page (html, <Navbar/>, <main>)
├── globals.css                 ← Tailwind import + global CSS
├── (public)/                   ← route group: organises files, NOT part of the URL
│   ├── page.tsx                → /
│   ├── showcase/page.tsx       → /showcase
│   ├── signin/page.tsx         → /signin
│   └── unauthorised/page.tsx   → /unauthorised
├── (protected)/                ← route group for pages that need sign-in (see note)
│   ├── dashboard/
│   │   ├── page.tsx            → /dashboard           (CONVENER)
│   │   └── _components/        ← private folder: never becomes a URL
│   ├── projects/
│   │   ├── page.tsx            → /projects            (STUDENT)
│   │   └── _components/
│   └── eoi/[type]/
│       ├── page.tsx            → /eoi/mentor, /eoi/sponsor  (dynamic segment)
│       └── _components/
└── api/auth/[...nextauth]/route.ts → /api/auth/*   (Auth.js endpoints)
```

| Convention | Meaning | Example here |
|---|---|---|
| `page.tsx` | The page for that URL | `src/app/(public)/showcase/page.tsx` |
| `layout.tsx` | Shared wrapper for the folder and everything below it | `src/app/layout.tsx` |
| `(folder)` | **Route group**: groups files without changing the URL. **It doesn't protect anything** | `(public)`, `(protected)` |
| `_folder` | **Private folder**: ignored by the router. We keep page-specific components here | `dashboard/_components/` |
| `[param]` | **Dynamic segment**: the value arrives in `params` (a Promise in Next 16: `const { type } = await params`) | `eoi/[type]/page.tsx` |
| `[...param]` | Catch-all segment | `api/auth/[...nextauth]` |
| `route.ts` | An HTTP endpoint (GET/POST) instead of a page | only Auth.js uses one |

Pages are **Server Components by default**. They run on the server, can be `async`, and can call Prisma directly. Add `"use client"` at the top of a file only when it needs browser features: state, event handlers, or hooks like `useActionState` and `usePathname`.

### Create a simple new page

Say you want a public "About" page at `/about`:

1. Create `src/app/(public)/about/page.tsx`:
   ```tsx
   import { PageHeader } from "@/components/page-header";

   export const metadata = { title: "About" }; // browser tab: "About · Uni Projects"

   export default function AboutPage() {
     return (
       <>
         <PageHeader title="About" description="How capstone project allocation works." />
         <p className="text-sm text-zinc-700">Students submit EOIs, conveners review them…</p>
       </>
     );
   }
   ```
2. Visit <http://localhost:3000/about>. The navbar and page width come from `src/app/layout.tsx` automatically.

---

## 2. Layouts and navigation

- **`src/app/layout.tsx`** renders `<html lang="en-AU">`, then `<Navbar />`, then `<main className="mx-auto max-w-5xl px-4 py-8">{children}</main>`. Every page is inserted as `children`. It also sets the title template `"%s · Uni Projects"`, which is why pages export `metadata = { title: "…" }`.
- **`src/components/nav/navbar.tsx`** is a Server Component:
  - It reads the user with `getCurrentUser()`.
  - It filters `NAV_ITEMS` by role.
  - It shows the Sign in / Sign out buttons.
- **`src/components/nav/nav-link.tsx`** is a small Client Component. It uses `usePathname()` to bold the current link and set `aria-current="page"`.

### Add a page to the nav
Edit the `NAV_ITEMS` array in `src/components/nav/navbar.tsx`:
```ts
const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/showcase", label: "Showcase" },
  { href: "/about", label: "About" },                                   // everyone
  { href: "/projects", label: "Projects", roles: ["STUDENT"] },
  { href: "/dashboard", label: "Dashboard", roles: ["CONVENER"] },
];
```
- No `roles` means everyone sees it. With `roles`, only signed-in users with one of those roles see it.
- **Hiding a link is not security.** The page itself must still call `requireRole` ([03](03-authentication.md#how-to-protect-a-new-page-or-action)).

### Links and redirects
- In-app links: `import Link from "next/link"` then `<Link href="/projects">View projects</Link>` (see `src/app/(public)/page.tsx`). Don't use a bare `<a>` for internal links; `Link` avoids full page reloads.
- Server-side redirects in pages and actions: `import { redirect } from "next/navigation"` then `redirect("/somewhere")`. That's how `requireUser` sends people to `/signin`.
- 404: `import { notFound } from "next/navigation"` then `notFound()`. See `eoi/[type]/page.tsx`.

---

## 3. How the frontend talks to the backend

We have **no REST API** for app data. Instead:

- **Reading data:** a **Server Component page** queries Prisma directly and renders HTML. No `fetch`, no `useEffect`.
- **Writing data:** a **form** calls a **Server Action**, an `async` function in `src/actions/*.ts` marked `"use server"`. Next.js turns it into a POST endpoint behind the scenes.

The full path from a button click to the database and back, using "Submit EOI" on `/projects` as the example:

```mermaid
sequenceDiagram
  autonumber
  actor S as Student
  participant F as StudentEoiForm<br/>(client, useActionState)
  participant A as submitStudentEoi<br/>(src/actions/eoi.ts)
  participant V as studentEoiSchema<br/>(src/lib/validation/eoi.ts)
  participant P as prisma<br/>(src/lib/prisma.ts)
  participant DB as PostgreSQL
  participant Pg as /projects page<br/>(server component)

  S->>F: Click "Submit EOI"
  F->>A: POST FormData (projectId, message); pending = true
  A->>A: authorize(["STUDENT"])
  A->>V: safeParse(...)
  alt invalid
    A-->>F: { status: "error", fieldErrors }
    F-->>S: Red messages under fields
  else valid
    A->>P: business-rule checks (project published? duplicate?)
    P->>DB: SELECT …
    A->>P: prisma.eoi.create(...)
    P->>DB: INSERT INTO "Eoi" …
    A->>A: revalidatePath("/projects"), revalidatePath("/dashboard")
    A-->>F: { status: "success", message }
    Pg->>DB: page re-renders with fresh data
    F-->>S: Green success message
  end
```

The pieces, and the file that shows each one:

| Piece | Our convention | Look at |
|---|---|---|
| Result type | `ActionState = { status: "idle" \| "success" \| "error"; message?; fieldErrors? }` and `initialActionState` | `src/lib/action-state.ts` |
| Action signature | `async function x(_prev: ActionState, formData: FormData): Promise<ActionState>` | `src/actions/users.ts` |
| Action steps | **1. Authorise → 2. Validate → 3. Business rules → 4. Write → 5. Revalidate → return** | the numbered comments in `src/actions/eoi.ts` |
| Validation | zod schema in `src/lib/validation/<feature>.ts`, errors via `z.flattenError(parsed.error).fieldErrors` | `src/lib/validation/eoi.ts` |
| Form | `"use client"`, `const [state, formAction, pending] = useActionState(action, initialActionState)`, then `<form action={formAction}>` | `src/app/(protected)/projects/_components/student-eoi-form.tsx` |
| Passing IDs | Hidden inputs such as `<input type="hidden" name="projectId" …>`, **re-checked on the server** | `student-eoi-form.tsx` + `submitStudentEoi` |
| Two buttons, one form | Give buttons `name`/`value`; the clicked one is sent | `review-eoi-form.tsx` (`decision=APPROVE/REJECT`) |
| Multi-step writes | `prisma.$transaction(async (tx) => { … })` + guarded `updateMany` | `src/actions/review.ts` |
| Expected vs unexpected errors | Expected: return `{ status: "error" }`. Unexpected: `throw` (goes to `error.tsx`) | `src/actions/review.ts` (`ReviewError`) |

---

## 4. Worked example: a "Manage projects" page

**Goal:** conveners get a page at **`/dashboard/projects`** that lists every project (draft or published) and has a form to **create** one. There's no project creation UI yet; `dashboard/page.tsx` even has a comment reserving space for it.

This example touches every layer:
- **Schema:** none needed; it reuses the existing `Project` model. To add a column as well, do [02 → Example A](02-database-and-prisma.md#4-worked-example-a-add-a-field-to-project) first.
- validation → server action → form → page → nav link → protection.

> ✅ This exact code was type-checked, linted and clicked through in a browser against a test database while writing this guide.

### Step 0: Branch
```
git checkout main
git pull origin main
git checkout -b feature/manage-projects
```

### Step 1: Validation schema (new file)
`src/lib/validation/project.ts`
```ts
import { z } from "zod";

/** FormData sends "" for an empty number input; treat that as "no limit". */
const optionalCapacity = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.coerce.number().int("Capacity must be a whole number.").min(1).max(50).optional(),
);

export const createProjectSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(120),
  summary: z.string().trim().min(10, "Add a one-line summary (at least 10 characters).").max(280),
  description: z.string().trim().min(20, "Describe the project (at least 20 characters).").max(5000),
  capacity: optionalCapacity,
  status: z.enum(["DRAFT", "PUBLISHED"]),
});
```
The limits mirror the schema: `capacity Int?` (null = unlimited) and `status ProjectStatus`. We deliberately don't allow `UNPUBLISHED` on create.

### Step 2: Server action (new file)
`src/actions/projects.ts`
```ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/authz";
import { createProjectSchema } from "@/lib/validation/project";
import type { ActionState } from "@/lib/action-state";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function createProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // 1. Authorise
  const auth = await authorize(["CONVENER"]);
  if (!auth.ok) return { status: "error", message: auth.error };
  const { user } = auth;

  // 2. Validate input
  const parsed = createProjectSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const { title, summary, description, capacity, status } = parsed.data;

  // 3. Business rules: slugs must be unique
  const base = slugify(title) || "project";
  const taken = await prisma.project.findUnique({ where: { slug: base }, select: { id: true } });
  const slug = taken ? `${base}-${Date.now().toString(36)}` : base;

  // 4. Write (createdById comes from the session, never from the form)
  await prisma.project.create({
    data: { title, slug, summary, description, capacity: capacity ?? null, status, createdById: user.id },
  });

  // 5. Refresh affected pages
  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");

  return { status: "success", message: `Created "${title}".` };
}
```
A `"use server"` file may only **export** async functions. Helpers like `slugify` must stay un-exported, or move to `src/lib/`.

### Step 3: Form component (new file)
`src/app/(protected)/dashboard/projects/_components/create-project-form.tsx`
```tsx
"use client";

import { useActionState } from "react";
import { createProject } from "@/actions/projects";
import { initialActionState } from "@/lib/action-state";

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? <p className="text-sm text-red-600">{errors[0]}</p> : null;
}

export function CreateProjectForm() {
  const [state, formAction, pending] = useActionState(createProject, initialActionState);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border bg-white p-4">
      <h2 className="font-semibold">New project</h2>

      <label className="block text-sm font-medium" htmlFor="title">Title</label>
      <input id="title" name="title" className="w-full rounded-md border p-2 text-sm"
        aria-invalid={!!state.fieldErrors?.title} />
      <FieldError errors={state.fieldErrors?.title} />

      <label className="block text-sm font-medium" htmlFor="summary">One-line summary</label>
      <input id="summary" name="summary" className="w-full rounded-md border p-2 text-sm"
        aria-invalid={!!state.fieldErrors?.summary} />
      <FieldError errors={state.fieldErrors?.summary} />

      <label className="block text-sm font-medium" htmlFor="description">Description</label>
      <textarea id="description" name="description" rows={4} className="w-full rounded-md border p-2 text-sm"
        aria-invalid={!!state.fieldErrors?.description} />
      <FieldError errors={state.fieldErrors?.description} />

      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="capacity">Capacity (optional)</label>
          <input id="capacity" name="capacity" type="number" min={1} max={50}
            className="w-32 rounded-md border p-2 text-sm" />
          <FieldError errors={state.fieldErrors?.capacity} />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue="DRAFT" className="rounded-md border p-2 text-sm">
            <option value="DRAFT">Draft (hidden from students)</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>

      <button
        disabled={pending}
        className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create project"}
      </button>

      {state.status === "success" && <p className="text-sm text-green-700">{state.message}</p>}
      {state.status === "error" && !state.fieldErrors && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}
    </form>
  );
}
```

Unlike the EOI forms, which swap themselves for a success message, this form **stays visible** so a convener can add several projects in a row.

React 19 **clears the form's fields after every submission**, including ones that fail validation. To keep what the user typed after an error, return the submitted values in the action's result and use them as `defaultValue`s. That's a nice follow-up improvement for all our forms.

### Step 4: The page (new file)
`src/app/(protected)/dashboard/projects/page.tsx`
```tsx
import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { CreateProjectForm } from "./_components/create-project-form";

export const metadata = { title: "Manage projects" };

export default async function ManageProjectsPage() {
  await requireRole(["CONVENER"], { callbackUrl: "/dashboard/projects" });

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      summary: true,
      status: true,
      capacity: true,
      _count: {
        select: {
          assignments: { where: { type: "STUDENT" } },
          eois: { where: { status: "PENDING" } },
        },
      },
    },
  });

  return (
    <>
      <PageHeader title="Manage projects" description={`${projects.length} projects`} />

      <div className="grid gap-8 md:grid-cols-[1fr_22rem]">
        <section>
          {projects.length === 0 ? (
            <EmptyState title="No projects yet" description="Create the first one with the form." />
          ) : (
            <ul className="divide-y rounded-lg border bg-white">
              {projects.map((p) => (
                <li key={p.id} className="p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-semibold">{p.title}</h2>
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">{p.status.toLowerCase()}</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600">{p.summary}</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {p._count.assignments}/{p.capacity ?? "∞"} students · {p._count.eois} pending EOIs
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside>
          <CreateProjectForm />
        </aside>
      </div>
    </>
  );
}
```

### Step 5: Protection: already covered, and here's why
- `/dashboard/projects` starts with `/dashboard`:
  - `ROLE_ROUTES` in `src/lib/access.ts` already requires `CONVENER` for it (via `matchesPrefix`).
  - The matcher `"/dashboard/:path*"` in `src/proxy.ts` already covers it.
  - So no changes are needed there.
- The page calls `requireRole(["CONVENER"])`, and the action calls `authorize(["CONVENER"])`. All three layers are in place.
- For a URL outside an existing prefix, follow [03 → How to protect a new page](03-authentication.md#how-to-protect-a-new-page-or-action).

### Step 6: Link to it
Add a link from the convener dashboard. In `src/app/(protected)/dashboard/page.tsx`, pass an `actions` prop to the existing `PageHeader` (it already supports one):
```tsx
import Link from "next/link";
// …
<PageHeader
  title="Convener dashboard"
  description={`${pending.length} pending EOIs`}
  actions={<Link href="/dashboard/projects" className="rounded-md border px-3 py-1.5 text-sm">Manage projects</Link>}
/>
```
Alternatively, add a nav item in `navbar.tsx`: `{ href: "/dashboard/projects", label: "Projects admin", roles: ["CONVENER"] }`.

`NavLink` highlights any link whose `href` is a prefix of the current URL. On `/dashboard/projects`, both "Dashboard" and "Projects admin" would look active.

### Step 7: Try it
1. `npm run dev`, then sign in as your seeded convener.
2. Go to <http://localhost:3000/dashboard/projects>.
3. Click **Create project** with empty fields. You should see red errors under Title, Summary and Description.
4. Fill it in with **Status: Published**, then create. The project appears at the top of the list with a green `Created "…"` message.
5. Sign in as a **student** (a second Google account that a convener assigned the STUDENT role). The new project shows on `/projects`, because `revalidatePath("/projects")` refreshed it.
6. As the student, visit `/dashboard/projects`. You should be redirected to `/unauthorised`.

### Step 8: Check and open a PR
```
npm run lint
npm run typecheck
git add src/lib/validation/project.ts src/actions/projects.ts "src/app/(protected)/dashboard"
git commit -m "feat: add convener page to list and create projects"
git push -u origin feature/manage-projects
gh pr create --base main --fill
```

On macOS/Linux, quote paths containing parentheses as shown. PowerShell also needs the quotes.

---

## 5. Where things live, and conventions

| What | Where | Convention |
|---|---|---|
| Pages | `src/app/(public)/…` or `src/app/(protected)/…` | `page.tsx`, default export `XxxPage`, `export const metadata = { title }` |
| Page-only components | `<route>/_components/kebab-case.tsx` | Named export in PascalCase: `export function ReviewEoiForm` |
| Shared components | `src/components/` (`page-header.tsx`, `empty-state.tsx`, `nav/`) | Reuse `PageHeader` for every page title and `EmptyState` for "nothing here" |
| Server actions | `src/actions/<feature>.ts` | `"use server"` at the top; the 5-step pattern; return `ActionState` |
| Validation | `src/lib/validation/<feature>.ts` | zod; export `xxxSchema`; friendly messages |
| Auth helpers | `src/lib/authz.ts`, `src/lib/access.ts` | Server-only |
| DB client | `src/lib/prisma.ts` | Import `{ prisma }`; never `new PrismaClient()` elsewhere |
| Types from the DB | `@/generated/prisma/client` | `import type { Role } from "@/generated/prisma/client"` |
| Styling | Tailwind classes inline; `src/app/globals.css` for globals | Neutral `zinc` palette, `rounded-md border`, primary buttons `bg-zinc-900 text-white`, errors `text-red-600`, success `text-green-700` |
| Imports | Use the `@/` alias (maps to `src/`) | `import { prisma } from "@/lib/prisma"` |
| Dates | `toLocaleDateString("en-AU")` | Matches `<html lang="en-AU">` |
| Accessibility | Every input has a `<label htmlFor>`; invalid inputs get `aria-invalid`; nav uses `aria-current` | See the existing forms |
| Data fetching | Always `select` only the fields you render; run independent queries with `Promise.all` | `dashboard/page.tsx` |

---

## 6. Loading states, errors and protected pages

**Pending buttons (already used everywhere):** `useActionState` returns `pending`. Disable the button and change its label, e.g. `{pending ? "Submitting…" : "Submit EOI"}`.

**Page loading UI (new file, optional):** add `loading.tsx` next to a `page.tsx`. It shows instantly while the server page is fetching:
```tsx
// src/app/(protected)/dashboard/projects/loading.tsx
export default function Loading() {
  return <p className="text-sm text-zinc-500">Loading projects…</p>;
}
```

**Error UI (new file, recommended):** there's no `error.tsx` anywhere yet, even though `src/actions/review.ts` rethrows unexpected errors expecting one. Add one per section, or one at `src/app/error.tsx` for the whole app. In **Next 16** the prop is `retry`:
```tsx
// src/app/(protected)/dashboard/projects/error.tsx
"use client"; // Error boundaries must be Client Components

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <h2 className="font-medium">Something went wrong loading this page.</h2>
      {error.digest && <p className="mt-1 text-xs text-zinc-500">Error ID: {error.digest}</p>}
      <button onClick={() => retry()} className="mt-4 rounded-md border px-3 py-1.5 text-sm">
        Try again
      </button>
    </div>
  );
}
```
In production, the real error message is hidden from users. Match the `digest` against the server logs (`docker compose -f docker-compose.prod.yml logs app`).

**Expected errors** (validation, "already reviewed", "project is full") should **not** throw. Return `{ status: "error", message }` from the action and show it in the form.

**Auth-protected pages:** the first line of the page is `await requireRole([...])` or `await requireUser(...)`. Details are in [03](03-authentication.md#how-to-protect-a-new-page-or-action).

**Empty states:** use `<EmptyState title="…" description="…" action={<Link …/>} />` instead of a blank page.

---

## 7. Troubleshooting

| Symptom | Fix |
|---|---|
| New page shows 404 | The file must be named exactly `page.tsx`, in a folder **not** starting with `_`. Restart `npm run dev` if you renamed folders. |
| `You're importing a component that needs useState/useActionState. This React hook only works in a client component` | Add `"use client";` as the **first line** of that component file. |
| `Only async functions are allowed to be exported in a "use server" file` | Move constants, types and helpers out of `src/actions/*.ts` into `src/lib/`, or don't export them. |
| Form submits but the list doesn't update | You forgot `revalidatePath("/that/page")` in the action. |
| Field errors never show | The zod key must match the input's `name` and the `state.fieldErrors?.<key>` you render. |
| `Property 'xyz' does not exist` on a Prisma result | Add it to the `select`. If it's a new column, run `npx prisma generate` ([02](02-database-and-prisma.md)). |
| `Hydration failed because the server rendered HTML didn't match the client` | Usually dates/`Math.random()`/`window` used during render in a client component. Format dates on the server and pass strings down. |
| `params` is a Promise / "params should be awaited" | In Next 16, `params` and `searchParams` are Promises: `const { type } = await params;` |
| Tailwind class has no effect | Check the spelling (the Tailwind IntelliSense extension helps). Tailwind v4 is configured in CSS (`@import "tailwindcss"` in `globals.css`); there's no `tailwind.config.js`. |
| Text is unreadable in dark mode | Known issue: `globals.css` switches the page background to dark via `prefers-color-scheme`, but the white cards (`bg-white`) keep light text colours. Test in light mode for now, or fix `globals.css` in a dedicated PR. |
| `/dashboard` crashes with `SetRoleForm is not defined` | Known bug (missing import); see [README → Known issues](README.md#known-issues-to-be-aware-of-as-of-this-writing). |
