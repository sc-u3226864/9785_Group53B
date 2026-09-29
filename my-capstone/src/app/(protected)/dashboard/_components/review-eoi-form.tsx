"use client";

import { useActionState } from "react";
import { reviewEoi } from "@/actions/review";
import { initialActionState } from "@/lib/action-state";

type Props = {
  eoiId: string;
  needsProject: boolean; // true for mentor/sponsor EOIs
  projects: { id: string; title: string }[];
};

export function ReviewEoiForm({ eoiId, needsProject, projects }: Props) {
  const [state, formAction, pending] = useActionState(reviewEoi, initialActionState);

  if (state.status === "success") {
    return <p className="text-sm text-green-700">{state.message}</p>;
  }

  return (
    <form action={formAction} className="mt-3 space-y-2">
      <input type="hidden" name="eoiId" value={eoiId} />

      {needsProject && (
        <select name="projectId" defaultValue="" className="w-full rounded-md border p-2 text-sm">
          <option value="">Assign to project… (required to approve)</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      )}

      <textarea
        name="reviewNote"
        rows={2}
        placeholder="Optional note"
        className="w-full rounded-md border p-2 text-sm"
      />

      <div className="flex gap-2">
        {/* The clicked button's name/value is included in the FormData */}
        <button
          name="decision"
          value="APPROVE"
          disabled={pending}
          className="rounded-md bg-green-700 px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          Approve
        </button>
        <button
          name="decision"
          value="REJECT"
          disabled={pending}
          className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
        >
          Reject
        </button>
      </div>

      {state.status === "error" && <p className="text-sm text-red-600">{state.message}</p>}
    </form>
  );
}