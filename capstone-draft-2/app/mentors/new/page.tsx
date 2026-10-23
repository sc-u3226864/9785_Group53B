import Link from "next/link";
import { requireRole } from "../../lib/session";
import { createMentorPost } from "../../actions/actions";
import PostForm from "../PostForm";

export default async function NewPostPage() {
  await requireRole("CONVENER");

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 20 , backgroundColor: "white"}}>
      <h1>Create Mentor Post</h1>
      <PostForm action={createMentorPost} /> {/*passes the createMentorPost function as a prop to the PostForm component, which will be called when the form is submitted*/}
      <p className="text-center" ><Link href="/mentors">Cancel</Link></p>
    </main>
  );
}