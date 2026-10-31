import { setPassword } from "../actions/actions";

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>; //checking if the url has a token and error
}) {
  const { token, error } = await searchParams;
  if (!token) {
    return <main><p className="text-center">This link is invalid or has expired. Request a new one on the sign-in page.</p></main>; //if no token in the url then show this message
  }
  return (
    <main>
      <h1 className="text-[#006c91]">Set your password</h1>
      {error && <p> Couldn&apos;t set your password. The link may have expired; request a new one on the sign-in page.</p>} {/*if error is present show this message */}
      <form className="flex flex-col" action={setPassword}>
        <input type="hidden" name="token" value={token} />
        <input className="form-input mx-auto mt-3" name="password" type="password" minLength={8} placeholder="New password" required />
        <button className="form-button mx-auto mt-3">Save password</button>
      </form>
    </main>
  );
  
}