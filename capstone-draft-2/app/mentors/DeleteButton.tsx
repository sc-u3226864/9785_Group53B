"use client";

import { deleteMentorPost } from "../actions/actions";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <form
    className="form-button"
      action={deleteMentorPost}
      onSubmit={(e) => { //e is the submit event, it checks the user wants to proceed with the browser confirm
        if (!confirm("Are you sure you want to delete this post?")) {
          e.preventDefault(); //stops the form from submitting
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="cursor-pointer" type="submit">Delete</button>
    </form>
  );
}