import Link from "next/link";
import { requireRole } from "../../lib/session";
import { createProject } from "../../actions/actions";
import PostForm from "../PostForm";

export default async function NewPostPage() {
  await requireRole("SPONSOR"); //only sponsors can create posts

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 20 , backgroundColor: "white"}}>
      <h1>Create Project Post</h1>
      <PostForm action={createProject} /> {/*passes the createProject function as a prop to the PostForm component, which will be called when the form is submitted*/}
      <p className="text-center" ><Link href="/sponsors">Cancel</Link></p>
    </main>
  );
}