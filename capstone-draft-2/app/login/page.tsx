// https://nextjs.org/docs/app/api-reference/file-conventions/page#displaying-content-based-on-params

import { login, sendPasswordLink} from "../actions/actions";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; linkSent?: string }>;  //checks if url has error or linkSent query params and displays the appropriate message
}) {
  const { error, linkSent } = await searchParams; //returns object with error and linkSent if they exist in the url e.g. /sign-in?error=1 or /sign-in?linkSent=1
  return (
    <main>
      <h1 className="text-[#006c91]">Sign in</h1>
      {error && <p>Invalid email or password.</p>}
      <div className="flex flex-col items-center mt-3">
        <form className="flex flex-col"  action={login}>
          <input className="form-input mb-2 pl-1" name="email" type="email" placeholder="Email" required />
          <input className="form-input mb-2 pl-1" name="password" type="password" placeholder="Password" required />
          <button className="form-button mx-auto mt-2">Sign in</button>
        </form>
      </div>

      <h2 className="text-gray-700! text-xl! mt-4!">Forgot your password, or your invite link expired?</h2>
      {linkSent && <p>If that email has an account, a new link is on its way.</p>}
      <div className="flex flex-col items-center">
        <form className="flex flex-col" action={sendPasswordLink}>
          <input className="form-input mb-2 pl-1" name="email" type="email" placeholder="Email" required />
          <button className="form-button mx-auto mt-2">Send me a new link</button>
        </form>
      </div>
    </main>
  );
}