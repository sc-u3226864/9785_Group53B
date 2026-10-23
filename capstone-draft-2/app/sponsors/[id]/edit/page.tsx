import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "../../../lib/prisma";
import { requireRole } from "../../../lib/session";
import { updateSponsorPost } from "../../../actions/actions";
import PostForm from "../../PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("CONVENER");

  const { id } = await params;
  const post = await prisma.sponsorPost.findUnique({ where: { id } }); //gets the post data from the id in the URL

  if (!post) notFound();

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <h1>Edit Sponsor Post</h1>
      <PostForm action={updateSponsorPost} post={post} /> {/*passes the updateSponsorPost function as a prop to the PostForm component, which will be called when the form is submitted. It also passes the post object as a prop to pre-fill the form with the existing post data*/}
      <p className="text-center"><Link href="/sponsors">Cancel</Link></p>
    </main>
  );
}