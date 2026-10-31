// ------ REFERENCES
/** [1]
 * Description:
 * Reference: Vercel. (n.d.). page.js: Displaying content based on params. Next.js Documentation. https://nextjs.org/docs/app/api-reference/file-conventions/page#displaying-content-based-on-params
 */
/** [2]
 * Description:
 * Reference: Anthropic. (2026). Claude [Large language model]. https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d
 */
import { login, sendPasswordLink} from "../actions/actions";

export default async function SignInPage({ //[2]
  searchParams,
}: {
  searchParams: Promise<{ error?: string; linkSent?: string }>;  //checks if url has error or linkSent query params and displays the appropriate message
}) {
  const { error, linkSent } = await searchParams; //returns object with error and linkSent if they exist in the url e.g. /sign-in?error=1 or /sign-in?linkSent=1 [1]
  return (
    <main>
      <h1 className="text-[#006c91]">Sign in</h1>
      {error && <p className="text-center">Invalid email or password.</p>}
      <div className="flex flex-col items-center mt-3">
        <form className="flex flex-col"  action={login}>
          <input className="form-input mb-2 pl-1" name="email" type="email" placeholder="Email" required />
          <input className="form-input mb-2 pl-1" name="password" type="password" placeholder="Password" required />
          <button className="form-button mx-auto mt-2">Sign in</button>
        </form>
      </div>

      <h2 className="text-gray-700! text-xl! mt-4!">Forgot your password, or your invite link expired?</h2>
      {linkSent && <p className="text-center mb-1">If that email has an account, a new link is on its way.</p>}
      <div className="flex flex-col items-center">
        <form className="flex flex-col" action={sendPasswordLink}>
          <input className="form-input mb-2 pl-1" name="email" type="email" placeholder="Email" required />
          <button className="form-button mx-auto mt-2">Send me a new link</button>
        </form>
      </div>
    </main>
  );
}