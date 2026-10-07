import SponsorExpressInterest from "@/app/components/SponsorEOISubmission"


export default function SponsorPage() {
  return (
    <div className="page-content-box">
      <h1 className=" text-2xl font-bold">Sponsors</h1>
      <SponsorExpressInterest />
    </div>
  );
}

// TO-DO: make a part restricted to sponsors signed in only, so that they can access the project proposal form
