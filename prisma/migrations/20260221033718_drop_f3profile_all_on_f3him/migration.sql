/*
  Warnings:

  - You are about to drop the `f3_profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "f3_profiles" DROP CONSTRAINT "f3_profiles_f3himId_fkey";

-- AlterTable
ALTER TABLE "f3_hims" ADD COLUMN     "availability" TEXT,
ADD COLUMN     "volunteerSkills" TEXT;

-- DropTable
DROP TABLE "f3_profiles";
