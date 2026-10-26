/*
  Warnings:

  - Added the required column `cvfile` to the `EOIForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EOIForm" ADD COLUMN     "cvfile" TEXT NOT NULL;
