-- AlterTable
ALTER TABLE "MentorEOIForm" ADD COLUMN     "Approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProjectProposalForm" ADD COLUMN     "Approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SponsorEOIForm" ADD COLUMN     "Approved" BOOLEAN NOT NULL DEFAULT false;
