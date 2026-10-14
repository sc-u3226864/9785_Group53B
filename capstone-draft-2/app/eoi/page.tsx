import { submitEOI } from "../actions/actions";

export default async function EoiPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) { //if the url has eoi?sent=1 then return thankyou message, otherwise return eoi form
  const { sent } = await searchParams;
  if (sent) return <main><p>Thanks! A convener will review your expression of interest.</p></main>;
  return (
    <main>
      <h1>Express your interest</h1>
      <form action={submitEOI}>
        <select name="role" required>
          <option value="SPONSOR">Sponsor</option>
          <option value="MENTOR">Mentor</option>
        </select>
        <input name="name" placeholder="Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="organisation" placeholder="Organisation (optional)" />
        <input name="phone" placeholder="Phone (optional)" />
        <textarea name="experience" placeholder="Tell us about yourself" required />
        <button>Submit</button>
      </form>
    </main>
  );
} 