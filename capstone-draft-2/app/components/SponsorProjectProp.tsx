
"use client";

import { useState, type SubmitEvent } from "react";

export type SponsorProjectInput = {
  ProposalTitle:  string
  Sponsor       : string
  SponsorCompany?: string
  Description   : string
  Scope         : string
  SkillsRequired : string
};

export default function SponsorProjectProposal() {
  const [open, setOpen] = useState(false); // tracks if the form is open or not
  const [submitted, setSubmitted] = useState(false); // tracks if the form has been submitted or not

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) { //this function will run when the form is submitted, e is the event object that contains the form data
    e.preventDefault();  // prevents the default form submission behaviour: reloading the page
    const fd = new FormData(e.currentTarget); // creates a FormData object from the form element e, stores in fd as key-value pairs of the form data
    // convert the FormData object to a SponsorProjectInput object, which is the shape of the data we want to send to the backend
    const data: SponsorProjectInput = {
      ProposalTitle: String(fd.get("ProposalTitle")),
      Sponsor: String(fd.get("Sponsor")),
      SponsorCompany: String(fd.get("SponsorCompany") || "") || undefined,
      Description: String(fd.get("Description")),
      Scope: String(fd.get("Scope")),
      SkillsRequired: String(fd.get("SkillsRequired")),

    };

    // TODO: replace with API call, e.g.
    // await fetch("/api/mentor-eoi", { method: "POST", body: JSON.stringify(data) });
    console.log("EOI form data:", data);

    setSubmitted(true); // set the submitted state to true so that the form is replaced with a thank you message
  }

  if (!open) {
    return <button onClick={() => setOpen(true)}>Express Interest</button>;
  }

  if (submitted) {
    return <p>Thanks! We&apos;ll be in touch.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="ProposalTitle" placeholder="Proposal Title" required />
      <input name="Sponsor" placeholder="Sponsor" required />
      <input name="SponsorCompany" placeholder="Sponsor Company (optional)" />
      <input name="Description" placeholder="Description" required />
      <input name="Scope" placeholder="Scope" required />
      <textarea name="SkillsRequired" placeholder="Skills Required" required />

      <button type="submit">Submit</button>
      <button type="button" onClick={() => setOpen(false)}>Cancel</button> {/* button to close the form without submitting */}
    </form>
  );
} 