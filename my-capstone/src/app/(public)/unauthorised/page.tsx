import Link from "next/link";
import { EmptyState } from "@/components/empty-state";

export const metadata = { title: "Not authorised" };

export default function UnauthorisedPage() {
  return (
    <EmptyState
      title="You don't have access to this page"
      description="If you've submitted an EOI, it may still be awaiting review."
      action={<Link href="/" className="underline">Back to home</Link>}
    />
  );
}