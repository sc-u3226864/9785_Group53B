//https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d
import prisma from "../lib/prisma";
import { requireRole } from "../lib/session";
import { approveEoi, deleteEoi, reviewProject} from "../actions/actions";

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
          <div className="">
            <form className="post flex-col!">
              <div className="flex flex-row!">
                <div>
                  <p className="flex justify-start text-gray-800 font-bold text-xl"><b>{eOIForm.name}</b></p>
                  <p className="flex justify-start font-bold">{eOIForm.role}</p>
                  <p className="flex justify-start font-bold">{eOIForm.email}</p>
                  <p className="flex justify-start font-bold">{eOIForm.organisation}</p>
                  <p className="flex justify-start font-bold">{eOIForm.phone}</p>
                </div>
                <div className="flex flex-col gap-2 ml-auto">
                  <button className="form-button" formAction={approveEoi}>Approve</button>
                  <button className="form-button" formAction={deleteEoi}>Delete</button>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="flex justify-center">{eOIForm.experience}</p>
                <p className="flex justify-center "><a className="flex justify-center w-[200px] mx-auto my-1 bg-white rounded-xl text-gray-600 hover:bg-[#bae2eb]" href={`${eOIForm.cvfile}`} target="_blank" rel="noopener noreferrer">View CV</a></p>
                
                <input type="hidden" name="id" value={eOIForm.id} />
              </div>
            </form>
          </div>
        </div>
      ))}
      </div>
      <h2 className="!text-gray-600 text-center">Project proposals</h2>
      {projects.map((p) => (
        <form className="flex flex-col justify-center post" key={p.id} action={reviewProject}>
          <div className="flex flex-col!">
            <p className="flex justify-center text-xl"><b>{p.title}</b></p>
            <p className="flex justify-center text-lg">{p.sponsor.name}</p>
            <button className="form-button mt-2" name="status" value="APPROVED">Approve</button>
            <button className="form-button mt-2" name="status" value="REJECTED">Reject</button>
          </div>
          <p className="text-center"><b>Description: </b>{p.description}</p>
          <p className="text-center"><b>Scope: </b>{p.scope}</p>
          <p className="text-center"><b>Skills: </b>{p.skills}</p>
          <input type="hidden" name="id" value={p.id} />
          
        </form>
      ))}
    </main>
  );
}