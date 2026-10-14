// TO-DO setup mentor showcase

import prisma from "../lib/prisma"

export default async function MentorShowcase() {
    const mentors = await prisma.user.findMany({
    where: { role: "MENTOR" },
  });

  return (
    <main>
        <h1>Mentor Showcase</h1>
        {mentors.map((p) => (
        <article key={p.id}>
          <h2>{p.name}</h2>
          <p>Email: {p.email}</p>
          <p>Organisation: {p.organisation}</p>
          <p>Experience: {p.experience}</p>
          <p>{p.phone}</p>
        </article>
      ))}
    </main>
  )
}