/*
  Warnings:

  - You are about to drop the column `fromUserId` on the `ChatMessage` table. All the data in the column will be lost.
  - You are about to drop the column `toUserId` on the `ChatMessage` table. All the data in the column will be lost.
  - Added the required column `userId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "fromUserId",
DROP COLUMN "toUserId",
ADD COLUMN     "userId" TEXT NOT NULL;
