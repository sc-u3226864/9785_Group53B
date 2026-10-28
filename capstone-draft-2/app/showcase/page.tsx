import prisma from "../lib/prisma";
import { getSession } from "../lib/session";
import DeleteButton from "./DeleteButton";
import Link from "next/link";

export default async function ShowcasePage() {
  const session = await getSession();
  const posts = await prisma.showcasePost.findMany({ orderBy: { createdAt: "desc" } });
  const canManage = session?.user.role === "CONVENER";

  return (
    <main>
      <h1 className="text-[#006c91]">Showcase</h1>

      {canManage && <Link className="flex justify-center text-gray-600 hover:text-blue-300" href="/showcase/new">Create Post</Link>} {/*convener post button*/}

      {posts.length === 0 && <p className="text-gray-600 text-center">No showcase posts yet.</p>} {/*if there are no posts display this message*/}

      {posts.map((post) => (
        <div key={post.id} className="post">
          <div className="min-w-3xs">
            {post.showcaseImageURL && <img src={post.showcaseImageURL} alt={post.title} width={200} height={200} className="rounded-md"/>}
            {post.title && <h2 className="post-name">{post.title}</h2>}
            {post.semcompleted && post.yearcompleted && (
              <p className="mt-1"><b>Completed:</b> {post.semcompleted} {post.yearcompleted}</p>
            )}
            {post.sponsor && <p className="mt-1"><b>Sponsor:</b> {post.sponsor}</p>}
            {post.mentor && <p className="mt-1"><b>Mentor:</b> {post.mentor}</p>}
            {post.organisation && <p className="mt-1"><b>Organisation:</b> {post.organisation}</p>}
            {post.student1 && <p className="mt-1"><b>Student 1:</b> {post.student1}</p>}
            {post.student2 && <p className="mt-1"><b>Student 2:</b> {post.student2}</p>}
            {post.student3 && <p className="mt-1"><b>Student 3:</b> {post.student3}</p>}
            {canManage && (
              <div className="flex flex-col gap-2 mt-4">
                <Link className="border-2 border-solid px-[5px] rounded-md " href={`/showcase/${post.id}/edit`}>Edit</Link> {/*convener edit button*/}
                <DeleteButton id={post.id} /> {/*convener delete button*/}
              </div>
          )}
          </div>
          <div>
            {post.description && <p>{post.description}</p>}
          </div>
        </div>
      ))}

      
    </main>
  );
}

