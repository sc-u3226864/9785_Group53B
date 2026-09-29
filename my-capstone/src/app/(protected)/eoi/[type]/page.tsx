import { notFound } from "next/navigation";
import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { PartnerEoiForm } from "./_components/partner-eoi-form";

const TYPES = { mentor: "MENTOR", sponsor: "SPONSOR" } as const;

export default async function PartnerEoiPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const eoiType = TYPES[type as keyof typeof TYPES];
  if (!eoiType) notFound();

  const user = await requireUser(`/eoi/${type}`);
  const title = `Become a ${type}`;

  if (user.role && user.role !== eoiType) {
    return (
      <>
        <PageHeader title={title} />
        <EmptyState title={`Your account already has the ${user.role.toLowerCase()} role.`} />
      </>
    );
  }

  const pending = await prisma.eoi.findFirst({
    where: { applicantId: user.id, type: eoiType, status: "PENDING" },
    select: { createdAt: true },
  });
  if (pending) {
    return (
      <>
        <PageHeader title={title} />
        <EmptyState
          title="Your EOI is awaiting review"
          description={`Submitted ${pending.createdAt.toLocaleDateString("en-AU")}.`}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title={title} description={`Signed in as ${user.email}`} />
      <PartnerEoiForm type={eoiType} />
    </>
  );
}