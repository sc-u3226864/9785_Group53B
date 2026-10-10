//https://claude.ai/share/3dfe8541-7e44-42b9-9d80-efc7457a6921

"use client"; // This is a client component because it uses useState which handles clicks which is a client-side event

import { useState, type SubmitEvent } from "react";

// data shape based on the prisma schema for the SponsorEOI model
export type SponsorEOIInput = {
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNo?: string;
  ProfessionalTitle: string;
  ExperienceSummary: string;
};

export default function SponsorExpressInterest() {
  const [open, setOpen] = useState(false); // tracks if the form is open or not
  const [submitted, setSubmitted] = useState(false); // tracks if the form has been submitted or not

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) { //this function will run when the form is submitted, e is the event object that contains the form data
    e.preventDefault();  // prevents the default form submission behaviour: reloading the page
    const fd = new FormData(e.currentTarget); // creates a FormData object from the form element e, stores in fd as key-value pairs of the form data
    // convert the FormData object to a SponsorEOIInput object, which is the shape of the data we want to send to the backend
    const data: SponsorEOIInput = {
      FirstName: String(fd.get("FirstName")),
      LastName: String(fd.get("LastName")),
      Email: String(fd.get("Email")),
      PhoneNo: String(fd.get("PhoneNo") || "") || undefined,
      ProfessionalTitle: String(fd.get("ProfessionalTitle")),
      ExperienceSummary: String(fd.get("ExperienceSummary")),
    };

    // TODO: replace with API call, e.g.
    // await fetch("/api/sponsor-eoi", { method: "POST", body: JSON.stringify(data) });
    console.log("EOI form data:", data);

    setSubmitted(true); // set the submitted state to true so that the form is replaced with a thank you message
  }

  if (!open) {
    return <button className="eoi-button" onClick={() => setOpen(true)}>Express Interest</button>;
  }

  if (submitted) {
    return <p>Thanks! We&apos;ll be in touch.</p>;
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p className="form-title">Sponsor EOI Form</p>
      <div className="input-container">
        <input name="FirstName" placeholder="First name" required />
        <input name="LastName" placeholder="Last name" required />
        <input name="Email" type="email" placeholder="Email" required />
        <input name="PhoneNo" type="tel" placeholder="Phone (optional)" />
        <input name="ProfessionalTitle" placeholder="Professional title" required />
        <textarea name="ExperienceSummary" placeholder="Experience summary" required />
      </div>

      <button className="submit" type="submit">Submit</button>
      <button type="button" onClick={() => setOpen(false)}>Cancel</button> {/* button to close the form without submitting */}
    </form>
  );
}