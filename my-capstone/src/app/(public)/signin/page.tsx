import { signIn } from "@/lib/auth";

export const metadata = { title: "Sign in" };

function safeCallback(url?: string) {
  // Block open redirects: only allow same-site relative paths.
  return url?.startsWith("/") && !url.startsWith("//") ? url : "/";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const redirectTo = safeCallback(callbackUrl);

  return (
    <div className="mx-auto max-w-sm space-y-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="text-sm text-zinc-600">Use your Google account to continue.</p>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo });
        }}
      >
        <button className="w-full rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700">
          Continue with Google
        </button>
      </form>
    </div>
  );
}