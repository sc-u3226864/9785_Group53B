import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ReviewEoiForm } from "./_components/review-eoi-form";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  await requireRole(["CONVENER"], { callbackUrl: "/dashboard" });

  const [pending, projects, awaitingRole] = await Promise.all([
    prisma.eoi.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        applicant: { select: { name: true, email: true } },
        project: { select: { title: true } },
      },
    }),
    prisma.project.findMany({
      where: { status: { not: "UNPUBLISHED" } },
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
    prisma.user.findMany({
    // No role and no pending EOI means they're most likely a student waiting for access
    where: { role: null, eois: { none: { status: "PENDING" } } },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, createdAt: true },
    }),
  ]);

  return (
    <>
      <PageHeader title="Convener dashboard" description={`${pending.length} pending EOIs`} />
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">Users awaiting a role ({awaitingRole.length})</h2>
        {awaitingRole.length === 0 ? (
            <EmptyState title="Nobody waiting" />
        ) : (
            <ul className="divide-y rounded-lg border bg-white">
            {awaitingRole.map((u) => (
                <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                    <p className="font-medium">{u.name ?? u.email}</p>
                    <p className="text-xs text-zinc-500">
                    {u.email} · joined {u.createdAt.toLocaleDateString("en-AU")}
                    </p>
                </div>
                <SetRoleForm userId={u.id} />
                </li>
            ))}
            </ul>
        )}
        </section>

      {pending.length === 0 ? (
        <EmptyState title="All caught up" description="There are no EOIs waiting for review." />
      ) : (
        <ul className="space-y-4">
          {pending.map((eoi) => (
            <li key={eoi.id} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-semibold">
                  {eoi.applicant.name ?? eoi.applicant.email}{" "}
                  <span className="text-sm font-normal text-zinc-500">({eoi.type.toLowerCase()})</span>
                </h2>
                <time className="text-xs text-zinc-500">{eoi.createdAt.toLocaleDateString("en-AU")}</time>
              </div>
              {eoi.project && <p className="text-sm">Project: {eoi.project.title}</p>}
              {eoi.organisation && <p className="text-sm">Organisation: {eoi.organisation}</p>}
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{eoi.message}</p>
              <ReviewEoiForm
                eoiId={eoi.id}
                needsProject={eoi.type !== "STUDENT"}
                projects={projects}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Project create/edit/unpublish sections go here, using the same action pattern. */}
    </>
  );
}