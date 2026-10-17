"use client";

import { deleteSponsorPost } from "../actions/actions";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={deleteSponsorPost}
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