import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const convenerEmails = (process.env.SEED_CONVENER_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

async function main() {
  if (convenerEmails.length === 0) {
    console.warn("SEED_CONVENER_EMAILS is empty, so there's nothing to seed.");
    return;
  }

  // Pre-create conveners. When they sign in with Google, the account links by email.
  const conveners = await Promise.all(
    convenerEmails.map((email) =>
      prisma.user.upsert({
        where: { email },
        update: { role: "CONVENER" },
        create: { email, role: "CONVENER" },
      }),
    ),
  );
  const owner = conveners[0];

  const projects = [
    {
      slug: "capstone-eoi-portal",
      title: "Capstone EOI Portal",
      summary: "A web app for capstone project allocation.",
      description: "Sample project created by the seed script.",
    },
    {
      slug: "campus-events-app",
      title: "Campus Events App",
      summary: "Find and share events on campus.",
      description: "Sample project created by the seed script.",
    },
  ];
  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, status: "PUBLISHED", capacity: 5, createdById: owner.id },
    });
  }

  await prisma.showcasePost.upsert({
    where: { slug: "welcome" },
    update: {},
    create: {
      slug: "welcome",
      title: "Welcome to the showcase",
      content: "Sample post created by the seed script.",
      published: true,
      publishedAt: new Date(),
      authorId: owner.id,
    },
  });

  console.log(`Seeded ${conveners.length} convener(s), ${projects.length} projects, 1 post.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });