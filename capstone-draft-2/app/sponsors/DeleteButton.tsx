"use client";

import { deleteSponsorPost } from "../actions/actions";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <form
      className="border-2 border-solid px-[5px] rounded-md cursor-pointer" action={deleteSponsorPost}
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