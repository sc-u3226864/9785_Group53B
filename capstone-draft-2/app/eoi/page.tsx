import { submitEOI } from "../actions/actions";

export default async function EoiPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) { //if the url has eoi?sent=1 then return thankyou message, otherwise return eoi form
  const { sent } = await searchParams;
  if (sent) return <main><p>Thanks! A convener will review your expression of interest.</p></main>;
  return (
    <main>
      <div >
      <h1>Express your interest</h1>
        <form className="flex flex-col items-center gap-5 mt-4" action={submitEOI}>
          <select name="role" required>
            <option value="SPONSOR">Sponsor</option>
            <option value="MENTOR">Mentor</option>
          </select>
          <input className="form-input" name="name" placeholder="Name" required />
          <input className="form-input" name="email" type="email" placeholder="Email" required />
          <input className="form-input" name="organisation" placeholder="Organisation (optional)" />
          <input className="form-input" name="phone" placeholder="Phone (optional)" />
          <textarea className="form-input" name="experience" placeholder="Tell us about yourself" required />
          <button className="form-button">Submit</button>
        </form>
      </div>
    </main>
  );
} 