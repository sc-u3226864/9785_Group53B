// TO-DO make a sponsor showcase

import prisma from "../lib/prisma"

export default async function SponsorShowcase() {
    const sponsors = await prisma.user.findMany({
    where: { role: "SPONSOR" },
  });

  return (
    <main>
        <h1>Sponsor Showcase</h1>
        {sponsors.map((p) => (
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