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
      <h1 className="text-[#006c91]" >Dashboard</h1>

      <h2 className="!text-gray-600 text-center">Expressions of interest</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mx-3">
      {eois.map((eOIForm) => (
        <div key={eOIForm.id}>
          <form className="flex flex-row border-black border-[3px] rounded-md px-2">
            <div className="flex flex-col justify-start w-1/3">
              <p className="flex justify-start"><b>{eOIForm.name}</b></p>
              <p className="flex justify-start">{eOIForm.role}</p>
              <p className="flex justify-start">{eOIForm.email}</p>
              <p className="flex justify-start">{eOIForm.organisation}</p>
              <p className="flex justify-start">{eOIForm.phone}</p>
              <button formAction={approveEoi}>Approve</button>
              <button formAction={deleteEoi}>Delete</button>
            </div>
            <div className="flex flex-col justify-center w-2/3">
              <p className="flex justify-center">{eOIForm.experience}</p>
              <p className="flex justify-center"><a href={`${eOIForm.cvfile}`} target="_blank" rel="noopener noreferrer">View CV</a></p>
              
              <input type="hidden" name="id" value={eOIForm.id} />
            </div>
          </form>
        </div>
      ))}
      </div>
      <h2 className="!text-gray-600 text-center">Project proposals</h2>
      {projects.map((p) => (
        <form className="flex flex-col justify-center" key={p.id} action={reviewProject}>
          <p className="flex justify-center"><b>{p.title}</b> by {p.sponsor.name}</p>
          <p className="flex justify-center">{p.description}</p>
          <p className="flex justify-center">{p.scope}</p>
          <p className="flex justify-center">{p.skills}</p>
          <input type="hidden" name="id" value={p.id} />
          <button name="status" value="APPROVED">Approve</button>
          <button name="status" value="REJECTED">Reject</button>
        </form>
      ))}
    </main>
  );
}