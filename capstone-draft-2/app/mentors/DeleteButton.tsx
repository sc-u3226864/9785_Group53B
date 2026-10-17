"use client";

import { deleteMentorPost } from "../actions/actions";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={deleteMentorPost}
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this post?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit">Delete</button>
    </form>
  );
}