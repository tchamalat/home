/*
  Warnings:

  - You are about to drop the column `pp` on the `groups` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "groups" DROP COLUMN "pp",
ADD COLUMN     "avatarPath" TEXT;
