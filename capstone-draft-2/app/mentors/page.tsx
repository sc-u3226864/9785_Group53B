// TO-DO setup mentor showcase

import Link from "next/link";
import prisma from "../lib/prisma";
import DeleteButton from "./DeleteButton";
import { getSession } from "../lib/session";
import Image from "next/image";

export default async function MentorsPage() {
  const session = await getSession();
  const canManage = session?.user.role === "CONVENER"; //only convener can create, edit or delete posts
  const posts = await prisma.mentorPost.findMany({ orderBy: { name: "asc" } });
  

  return (
    <main>
      <h1>Mentors</h1>

      {canManage && <Link href="/mentors/new">Create Post</Link>} {/*convener post button*/}

      {posts.length === 0 && <p>No mentor posts yet.</p>} {/*if there are no posts display this message*/}

      {posts.map((post) => (
        <div key={post.id} style={{ border: "1px solid #ccc", padding: 12, marginTop: 12 }}>
          <Image src={post.imageURL} alt={post.name} width={80} height={80} />
          <h2>{post.name}</h2>
          <p>{post.experience}</p>
          {post.email && <p>Email: {post.email}</p>}
          {post.phone && <p>Phone: {post.phone}</p>}

          {canManage && (
            <div style={{ display: "flex", gap: 12 }}>
              <Link href={`/mentors/${post.id}/edit`}>Edit</Link> {/*convener edit button*/}
              <DeleteButton id={post.id} /> {/*convener delete button*/}
            </div>
          )}
        </div>
      ))}
    </main>
  );
}