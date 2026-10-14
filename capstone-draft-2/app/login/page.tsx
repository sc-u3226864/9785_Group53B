// https://nextjs.org/docs/app/api-reference/file-conventions/page#displaying-content-based-on-params

import { login, sendPasswordLink, logout } from "../actions/actions";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; linkSent?: string }>;  //checks if url has error or linkSent query params and displays the appropriate message
}) {
  const { error, linkSent } = await searchParams; //returns object with error and linkSent if they exist in the url e.g. /sign-in?error=1 or /sign-in?linkSent=1
  return (
    <main>
      <h1>Sign in</h1>
      {error && <p>Invalid email or password.</p>}
      <form action={login}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button>Sign in</button>
      </form>

      <h2>Forgot your password, or your invite link expired?</h2>
      {linkSent && <p>If that email has an account, a new link is on its way.</p>}
      <form action={sendPasswordLink}>
        <input name="email" type="email" placeholder="Email" required />
        <button>Send me a new link</button>
      </form>
      <button onClick={logout}>Logout</button>
    </main>
  );
}