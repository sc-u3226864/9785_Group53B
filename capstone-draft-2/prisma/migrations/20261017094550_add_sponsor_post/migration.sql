-- CreateTable
CREATE TABLE "SponsorPost" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "organisation" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "imageURL" TEXT NOT NULL DEFAULT '/images/pfp_default.jpg',

    CONSTRAINT "SponsorPost_pkey" PRIMARY KEY ("id")
);
