"use client";

import { useActionState } from "react";
import { submitPartnerEoi } from "@/actions/eoi";
import { initialActionState } from "@/lib/action-state";

export function PartnerEoiForm({ type }: { type: "MENTOR" | "SPONSOR" }) {
  const [state, formAction, pending] = useActionState(submitPartnerEoi, initialActionState);

  if (state.status === "success") {
    return <p className="text-sm text-green-700">{state.message}</p>;
  }

  return (
    <form action={formAction} className="max-w-xl space-y-3">
      <input type="hidden" name="type" value={type} />

      <label className="block text-sm font-medium" htmlFor="organisation">Organisation (optional)</label>
      <input id="organisation" name="organisation" className="w-full rounded-md border p-2 text-sm" />

      <label className="block text-sm font-medium" htmlFor="message">Why are you interested?</label>
      <textarea
        id="message"
        name="message"
        rows={5}
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