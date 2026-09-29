"use client";

import { useActionState } from "react";
import { setUserRole } from "@/actions/users";
import { initialActionState } from "@/lib/action-state";

export function SetRoleForm({ userId }: { userId: string }) {
  const [state, formAction, pending] = useActionState(setUserRole, initialActionState);

  if (state.status === "success") {
    return <p className="text-sm text-green-700">{state.message}</p>;
  }

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select name="role" defaultValue="STUDENT" className="rounded-md border p-1.5 text-sm">
        <option value="STUDENT">Student</option>
        <option value="MENTOR">Mentor</option>
        <option value="SPONSOR">Sponsor</option>
      </select>
      <button
        disabled={pending}
        className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white disabled:opacity-50"
      >
        Assign
      </button>
      {state.status === "error" && <p className="text-sm text-red-600">{state.message}</p>}
    </form>
  );
}