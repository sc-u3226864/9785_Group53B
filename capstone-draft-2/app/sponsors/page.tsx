
import Link from "next/link";
import prisma from "../lib/prisma";
import DeleteButton from "./DeleteButton";
import { getSession } from "../lib/session";
import Image from "next/image";

export default async function SponsorPage() {
  const session = await getSession();
  const canManage = session?.user.role === "CONVENER"; //only convener can create, edit or delete posts
  const posts = await prisma.sponsorPost.findMany({ orderBy: { name: "asc" } });
  

  return (
    <main>
      <h1 className="text-[#006c91]">Sponsors</h1>

      {canManage && <Link className="flex justify-center w-[200px] mx-auto my-1 bg-white rounded-xl text-gray-600 hover:bg-[#bae2eb]" href="/sponsors/new">Create Post</Link>} {/*convener post button*/}

      {posts.length === 0 && <p className="text-gray-600 text-center">No sponsor posts yet.</p>} {/*if there are no posts display this message*/}

      {posts.map((post) => (
        <div key={post.id} className="post">
          <div className="min-w-3xs">
            <Image src={post.imageURL} alt={post.name} width={200} height={200} className="rounded-md"/>
            {post.organisation && <p className="mt-1"><b>Organisation:</b> {post.organisation}</p>}
            {post.email && <p className="mt-1"><b>Email:</b> {post.email}</p>}
            {post.phone && <p className="mt-1"><b>Phone:</b> {post.phone}</p>}
            {canManage && (
              <div className="flex flex-col justify-center gap-3 mt-2">
                <Link className="form-button" href={`/sponsors/${post.id}/edit`}>Edit</Link> {/*convener edit button*/}
                <DeleteButton id={post.id} /> {/*convener delete button*/}
              </div>
          )}
          </div>
          <div>
            <h2 className="post-name">{post.name}</h2>
            <p>{post.experience}</p>

            
          </div>
        </div>
      ))}
    </main>
  );
}