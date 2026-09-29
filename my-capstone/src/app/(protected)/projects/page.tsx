import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { StudentEoiForm } from "./_components/student-eoi-form";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const user = await requireRole(["STUDENT"], { callbackUrl: "/projects" });

  const [projects, myEois, placement] = await Promise.all([
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        summary: true,
        capacity: true,
        _count: { select: { assignments: { where: { type: "STUDENT" } } } },
      },
    }),
    prisma.eoi.findMany({
      where: { applicantId: user.id, type: "STUDENT" },
      orderBy: { createdAt: "asc" }, // latest wins in the Map below
      select: { projectId: true, status: true },
    }),
    prisma.projectAssignment.findFirst({
      where: { userId: user.id, type: "STUDENT" },
      select: { project: { select: { title: true } } },
    }),
  ]);

  const statusByProject = new Map(myEois.map((e) => [e.projectId, e.status]));

  if (projects.length === 0) {
    return (
      <>
        <PageHeader title="Projects" />
        <EmptyState title="No projects open yet" description="Check back soon." />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Projects"
        description={
          placement
            ? `You're assigned to ${placement.project.title}.`
            : "Submit an EOI for the projects you're interested in."
        }
      />
      <ul className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => {
          const status = statusByProject.get(p.id);
          const full = p.capacity !== null && p._count.assignments >= p.capacity;
          return (
            <li key={p.id} className="rounded-lg border p-4">
              <h2 className="font-semibold">{p.title}</h2>
              <p className="mt-1 text-sm text-zinc-600">{p.summary}</p>
              {status ? (
                <p className="mt-3 text-sm">
                  Your EOI: <span className="font-medium">{status.toLowerCase()}</span>
                </p>
              ) : placement ? null : full ? (
                <p className="mt-3 text-sm text-zinc-500">This project is full.</p>
              ) : (
                <StudentEoiForm projectId={p.id} />
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}