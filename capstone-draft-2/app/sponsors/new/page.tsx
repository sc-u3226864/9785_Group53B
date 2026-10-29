import Link from "next/link";
import { requireRole } from "../../lib/session";
import { createSponsorPost } from "../../actions/actions";
import PostForm from "../PostForm";

export default async function NewPostPage() {
  await requireRole("CONVENER");

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 20 , backgroundColor: "white"}}>
      <h1>Create Sponsor Post</h1>
      <PostForm action={createSponsorPost} /> {/*passes the createSponsorPost function as a prop to the PostForm component, which will be called when the form is submitted*/}
      <p className="text-center mt-2" ><Link className="form-button" href="/sponsors">Cancel</Link></p>
    </main>
  );
}