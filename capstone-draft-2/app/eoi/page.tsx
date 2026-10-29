import { submitEOI } from "../actions/actions";

export default async function EoiPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) { //if the url has eoi?sent=1 then return thankyou message, otherwise return eoi form
  const { sent } = await searchParams;
  if (sent) return <main><p className="text-center font-bold text-xl mt-[30%]">Thanks! A convener will review your expression of interest.</p></main>;
  return (
    <main>
      <div >
      <h1 className="text-[#006c91]">Express your interest</h1>
      <div className="flex justify-center">
          <form className="flex flex-col gap-5 mt-4" action={submitEOI}>
            <select className="w-min bg-[#92cddb] rounded-sm px-1" name="role" required>
              <option value="SPONSOR">Sponsor</option>
              <option value="MENTOR">Mentor</option>
            </select>
            <input className="form-input" name="name" placeholder="Name" required />
            <input className="form-input" name="email" type="email" placeholder="Email" required />
            <input className="form-input" name="organisation" placeholder="Organisation (optional)" />
            <input className="form-input" name="phone" placeholder="Phone (optional)" />
            <textarea className="form-input" name="experience" placeholder="Tell us about yourself" required />
            <input className="hover:text-[#009abc] cursor-pointer border-black border-1 pl-1 rounded-md" type="file" name="file" required/>
            <button className="form-button">Submit</button>
          </form>
        </div>
      </div>
    </main>
  );
} 