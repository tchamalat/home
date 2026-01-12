/*
  Warnings:

  - You are about to drop the column `lastActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `pp` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "lastActive",
DROP COLUMN "pp",
ADD COLUMN     "avatarPath" TEXT;
