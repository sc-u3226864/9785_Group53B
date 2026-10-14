import prisma from "../lib/prisma";
import { requireRole } from "../lib/session";
import { approveEoi, deleteEoi, reviewProject, logout } from "../actions/actions";

export default async function DashboardPage() {
  await requireRole("CONVENER");                   // this is a convener only page so checking logged in user is a convener
  //fetching all pending EOI forms and projects
  const eois = await prisma.eOIForm.findMany({ where: { status: "PENDING" } });
  const projects = await prisma.project.findMany({
    where: { status: "PENDING" },
    include: { sponsor: { select: { name: true } } },
  });

  return (
    <main>
      <h1>Dashboard</h1>
      <form action={logout}><button>Sign out</button></form>

      <h2>Expressions of interest</h2>
      {eois.map((eOIForm) => (
        <form key={eOIForm.id}>
          <p><b>{eOIForm.name}</b> ({eOIForm.role}): {eOIForm.email}</p>
          <p>{eOIForm.organisation}</p>
          <p>{eOIForm.experience}</p>
          <input type="hidden" name="id" value={eOIForm.id} />
          <button formAction={approveEoi}>Approve</button>
          <button formAction={deleteEoi}>Delete</button>
        </form>
      ))}

      <h2>Project proposals</h2>
      {projects.map((p) => (
        <form key={p.id} action={reviewProject}>
          <p><b>{p.title}</b> by {p.sponsor.name}</p>
          <p>{p.description}</p>
          <p>{p.scope}</p>
          <p>{p.skills}</p>
          <input type="hidden" name="id" value={p.id} />
          <button name="status" value="APPROVED">Approve</button>
          <button name="status" value="REJECTED">Reject</button>
        </form>
      ))}
    </main>
  );
}