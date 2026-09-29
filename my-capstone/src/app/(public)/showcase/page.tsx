import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export const metadata = { title: "Showcase" };

export default async function ShowcasePage() {
  const posts = await prisma.showcasePost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: { id: true, title: true, excerpt: true, publishedAt: true, author: { select: { name: true } } },
  });

  if (posts.length === 0) {
    return (
      <>
        <PageHeader title="Showcase" />
        <EmptyState title="No posts yet" description="Check back soon." />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Showcase" />
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.id} className="rounded-lg border bg-white p-4">
            <h2 className="font-semibold">{p.title}</h2>
            {p.excerpt && <p className="mt-1 text-sm text-zinc-600">{p.excerpt}</p>}
            <p className="mt-2 text-xs text-zinc-500">
              {p.author.name ?? "Convener"} · {p.publishedAt?.toLocaleDateString("en-AU")}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}