"use client";

import { useState, type SubmitEvent } from "react";

export type ShowcasePostInput = {
  SemesterAndYear: string;
  Description: string;
  SponsorName: string;
  SponsorCompany?: string | null;
  StudentName1?: string | null;
  StudentName2?: string | null;
  StudentName3?: string | null;
  StudentName4?: string | null;
};

export default function ShowcasePost() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const data: ShowcasePostInput = {
      SemesterAndYear: String(fd.get("SemesterAndYear") ?? ""),
      Description: String(fd.get("Description") ?? ""),
      SponsorName: String(fd.get("SponsorName") ?? ""),
      SponsorCompany: String(fd.get("SponsorCompany") ?? "") || null,
      StudentName1: String(fd.get("StudentName1") ?? "") || null,
      StudentName2: String(fd.get("StudentName2") ?? "") || null,
      StudentName3: String(fd.get("StudentName3") ?? "") || null,
      StudentName4: String(fd.get("StudentName4") ?? "") || null,
    };

    console.log("Showcase post data:", data);
    setSubmitted(true);
  }

  if (!open) {
    return <button onClick={() => setOpen(true)}>Add Project</button>;
  }

  if (submitted) {
    return <p>Thanks! Your project has been added.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="SemesterAndYear" placeholder="Semester and year" required />
      <textarea name="Description" placeholder="Project description" required />
      <input name="SponsorName" placeholder="Sponsor name" required />
      <input name="SponsorCompany" placeholder="Sponsor company (optional)" />
      <input name="StudentName1" placeholder="Student name 1 (optional)" />
      <input name="StudentName2" placeholder="Student name 2 (optional)" />
      <input name="StudentName3" placeholder="Student name 3 (optional)" />
      <input name="StudentName4" placeholder="Student name 4 (optional)" />

      <button type="submit">Submit</button>
      <button type="button" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </form>
  );
}