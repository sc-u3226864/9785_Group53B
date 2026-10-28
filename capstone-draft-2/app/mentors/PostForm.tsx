import Image from "next/image";

//this component is used to create and edit mentor posts
//it takes in an action prop which is a function that will be called when the form is submitted

type Props = { // what a page must pass in
  action: (formData: FormData) => Promise<void>;
  post?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    experience: string;
    imageURL: string;
  };
};

export default function PostForm({ action, post }: Props) { //reusable form for createPost and updatePost actions
  return (
    <div style={{display:"flex", justifyContent:"center"}}>
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 500 }}>
      {post && <input type="hidden" name="id" value={post.id} />} {/*which post is being edited */}
      {post && <input type="hidden" name="existingImageURL" value={post.imageURL} />} {/* which image to keep if no new image is uploaded */}
      {post?.imageURL && (
        <Image src={post.imageURL} alt="Current" width={200} height={200} style={{ borderRadius: 8 }} />
      )}

      <label>
        Name *
        <input className="form-input" name="name" defaultValue={post?.name} placeholder="John Doe" required />
      </label>

      <label>
        Email
        <input className="form-input" name="email" type="email" defaultValue={post?.email ?? ""} placeholder="john.doe@example.com" />
      </label>

      <label>
        Phone
        <input className="form-input" name="phone" defaultValue={post?.phone ?? ""} placeholder="0412 345 678" />
      </label>

      <label>
        Experience *
        <textarea className="form-input" name="experience" defaultValue={post?.experience} rows={5} required placeholder="John Doe has over 10 years of experience at Big Corp as a Software Engineer..." />
      </label>

      <label>
        Image URL (leave blank for default)
        <input className="hover:text-[#009abc] cursor-pointer border-black border-1 pl-1 rounded-md" name="image" type="file" accept="image/*" />
      </label>

      <div className="flex justify-center mb-3"><button className="form-button" type="submit">Save</button></div> {/*submit button to save the form data, when clicked it will trigger the action function passed as a prop to the PostForm component*/}
    </form>
    </div>
  );
}