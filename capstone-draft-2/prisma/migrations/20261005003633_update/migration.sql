-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CONVENER', 'MENTOR', 'SPONSOR', 'STUDENT');

-- CreateTable
CREATE TABLE "SponsorEOIForm" (
    "FormId" TEXT NOT NULL,
    "DateCreated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "PhoneNo" TEXT,
    "ProfessionalTitle" TEXT NOT NULL,
    "ExperienceSummary" TEXT NOT NULL,

    CONSTRAINT "SponsorEOIForm_pkey" PRIMARY KEY ("FormId")
);

-- CreateTable
CREATE TABLE "MentorEOIForm" (
    "FormId" TEXT NOT NULL,
    "DateCreated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "PhoneNo" TEXT,
    "ProfessionalTitle" TEXT NOT NULL,
    "ExperienceSummary" TEXT NOT NULL,

    CONSTRAINT "MentorEOIForm_pkey" PRIMARY KEY ("FormId")
);

-- CreateTable
CREATE TABLE "ProjectProposalForm" (
    "FormId" TEXT NOT NULL,
    "CreationDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "ProposalTitle" TEXT NOT NULL,
    "Sponsor" TEXT NOT NULL,
    "SponsorCompany" TEXT,
    "Description" TEXT NOT NULL,
    "Scope" TEXT NOT NULL,
    "SkillsRequired" TEXT NOT NULL,

    CONSTRAINT "ProjectProposalForm_pkey" PRIMARY KEY ("FormId")
);

-- CreateTable
CREATE TABLE "ShowcasePost" (
    "ShowcasePostId" TEXT NOT NULL,
    "SemesterAndYear" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "SponsorName" TEXT NOT NULL,
    "SponsorCompany" TEXT,
    "StudentName1" TEXT,
    "StudentName2" TEXT,
    "StudentName3" TEXT,
    "StudentName4" TEXT,

    CONSTRAINT "ShowcasePost_pkey" PRIMARY KEY ("ShowcasePostId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SponsorEOIForm_FormId_key" ON "SponsorEOIForm"("FormId");

-- CreateIndex
CREATE UNIQUE INDEX "MentorEOIForm_FormId_key" ON "MentorEOIForm"("FormId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectProposalForm_FormId_key" ON "ProjectProposalForm"("FormId");

-- CreateIndex
CREATE UNIQUE INDEX "ShowcasePost_ShowcasePostId_key" ON "ShowcasePost"("ShowcasePostId");
