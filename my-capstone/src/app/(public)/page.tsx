import Link from "next/link";
import { getCurrentUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

const PARTICIPANT_ROLES = ["STUDENT", "MENTOR", "SPONSOR"] as const;

export default async function HomePage() {
  const user = await getCurrentUser();
  const isParticipant =
    !!user?.role && (PARTICIPANT_ROLES as readonly string[]).includes(user.role);

  if (user && isParticipant) {
    const assignments = await prisma.projectAssignment.findMany({
      where: { userId: user.id },
      select: { id: true, type: true, project: { select: { title: true, summary: true } } },
    });

    return (
      <>
        <PageHeader title={`Welcome, ${user.name?.split(" ")[0] ?? "there"}`} />
        {assignments.length === 0 ? (
          <EmptyState
            title="You're not assigned to a project yet"
            description={user.role === "STUDENT" ? "Browse projects and submit an EOI." : "A convener will assign you soon."}
            action={user.role === "STUDENT" ? <Link href="/projects" className="underline">View projects</Link> : undefined}
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {assignments.map((a) => (
              <li key={a.id} className="rounded-lg border bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">{a.type.toLowerCase()}</p>
                <h2 className="font-semibold">{a.project.title}</h2>
                <p className="mt-1 text-sm text-zinc-600">{a.project.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }

  // Public visitors, signed-in users with no role yet, and conveners
    return (
    <section className="space-y-6 py-12 text-center">
      <h1 className="text-3xl font-semibold">Industry projects, built by students</h1>

      {user && !user.role ? (
        <p className="mx-auto max-w-xl rounded-md border bg-white p-4 text-sm text-zinc-700">
          You're signed in, but your account doesn't have access yet.
          <br />
          <strong>Students:</strong> a convener will give you access soon.{" "}
          <strong>Mentors and sponsors:</strong> submit an EOI below.
        </p>
      ) : (
        <p className="mx-auto max-w-xl text-zinc-600">
          Partner with our students as a mentor or sponsor.
        </p>
      )}

      {user?.role !== "CONVENER" && (
        <div className="flex justify-center gap-3">
          <Link href="/eoi/mentor" className="rounded-md bg-zinc-900 px-4 py-2 text-white">Become a mentor</Link>
          <Link href="/eoi/sponsor" className="rounded-md border px-4 py-2">Become a sponsor</Link>
        </div>
      )}

      {user?.role === "CONVENER" && (
        <p><Link href="/dashboard" className="underline">Go to dashboard</Link></p>
      )}
    </section>
  );
}