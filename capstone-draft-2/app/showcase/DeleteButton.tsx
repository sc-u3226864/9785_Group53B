"use client";

import { deleteShowcasePost } from "../actions/actions";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <form
      className="form-button" action={deleteShowcasePost}
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this post?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="cursor-pointer" type="submit">Delete</button>
    </form>
  );
}