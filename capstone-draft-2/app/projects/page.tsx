import prisma from "../lib/prisma";
import { getSession } from "../lib/session";
import { createProject } from "../actions/actions";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const session = await getSession();
  const { submitted } = await searchParams;
  const projects = await prisma.project.findMany({
    where: { status: "APPROVED" },                      // the public only sees approved projects
    include: { sponsor: { select: { name: true } } },   // name of the sponsor
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <h1>Projects</h1>
      {submitted && <p>Thanks! Your proposal is awaiting review.</p>} {/* if the url has projects?submitted=1 then return thankyou message */}

      {session?.user.role === "SPONSOR" && (        // only sponsors get to see the form button
        <>
        <h2>Submit project proposal</h2>
        <form action={createProject}>
          <input name="title" placeholder="Title" required />
          <textarea name="description" placeholder="Description" required />
          <textarea name="scope" placeholder="Scope" required />
          <textarea name="skills" placeholder="Skills required" required />
          <button>Submit for review</button>
        </form>
        </>
      )}

      {projects.map((p) => (  // display the approved projects
        <article key={p.id}>
          <h2>{p.title}</h2>
          <p>Sponsored by {p.sponsor.name}</p>
          <p>Description: {p.description}</p>
          <p>Scope: {p.scope}</p>
          <p>Skills required: {p.skills}</p>
        </article>
      ))}
    </main>
  );
}