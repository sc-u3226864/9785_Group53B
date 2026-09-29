"use client";

import { useActionState } from "react";
import { submitStudentEoi } from "@/actions/eoi";
import { initialActionState } from "@/lib/action-state";

export function StudentEoiForm({ projectId }: { projectId: string }) {
  const [state, formAction, pending] = useActionState(submitStudentEoi, initialActionState);

  if (state.status === "success") {
    return <p className="text-sm text-green-700">{state.message}</p>;
  }

  return (
    <form action={formAction} className="mt-3 space-y-2">
      <input type="hidden" name="projectId" value={projectId} />
      <label className="block text-sm font-medium" htmlFor={`msg-${projectId}`}>
        Why are you interested?
      </label>
      <textarea
        id={`msg-${projectId}`}
        name="message"
        rows={4}
        className="w-full rounded-md border p-2 text-sm"
        aria-invalid={!!state.fieldErrors?.message}
      />
      {state.fieldErrors?.message && (
        <p className="text-sm text-red-600">{state.fieldErrors.message[0]}</p>
      )}
      {state.status === "error" && !state.fieldErrors && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}
      <button
        disabled={pending}
        className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Submit EOI"}
      </button>
    </form>
  );
}