/*
  Warnings:

  - You are about to drop the column `summary` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `body` on the `ShowcasePost` table. All the data in the column will be lost.
  - Added the required column `description` to the `ShowcasePost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mentor` to the `ShowcasePost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EOIForm" ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "summary";

-- AlterTable
ALTER TABLE "ShowcasePost" DROP COLUMN "body",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "mentor" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "experience" TEXT,
ADD COLUMN     "phone" TEXT;
