import prisma from "../lib/prisma";
import { getSession } from "../lib/session";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const session = await getSession();
  const canManage = session?.user.role === "SPONSOR";
  const { submitted } = await searchParams;
  const projects = await prisma.project.findMany({
    where: { status: "APPROVED" },                      // the public only sees approved projects
    include: { sponsor: { select: { name: true } } },   // name of the sponsor
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <h1 className="text-[#006c91]" >Projects</h1>
      {submitted && <p className="text-gray-600 text-center">Thanks! Your proposal is awaiting review.</p>} {/* if the url has projects?submitted=1 then return thankyou message */}

      {canManage && <Link className="flex justify-center w-[200px] mx-auto my-1 bg-white rounded-xl text-gray-600 hover:bg-[#bae2eb]" href="/projects/new">Submit Project Proposal</Link>}  {/* only sponsors get to see the form button */}

      {projects.length === 0 && <p className="text-gray-600 text-center">No sponsor posts yet.</p>}

      {projects.map((p) => (  // display the approved projects
        <article className="post" key={p.id}>
          <div>
            <h2>{p.title}</h2>
            <p>Sponsored by {p.sponsor.name}</p>
            <DeleteButton id={p.id} /> 
          </div>
          <p>Description: {p.description}</p>
          <p>Scope: {p.scope}</p>
          <p>Skills required: {p.skills}</p>
        </article>
      ))}
    </main>
  );
}
