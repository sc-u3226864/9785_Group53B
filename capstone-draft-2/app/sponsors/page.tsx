import SponsorExpressInterest from "@/app/components/SponsorEOISubmission"


export default function SponsorPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Sponsors</h1>
      <SponsorExpressInterest />
    </>
  );
}

// TO-DO: make a part restricted to sponsors signed in only, so that they can access the project proposal form
