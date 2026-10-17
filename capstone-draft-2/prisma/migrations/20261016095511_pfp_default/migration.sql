-- CreateTable
CREATE TABLE "MentorPost" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "experience" TEXT NOT NULL,
    "imageURL" TEXT NOT NULL DEFAULT '/images/pfp_default.jpg',

    CONSTRAINT "MentorPost_pkey" PRIMARY KEY ("id")
);
