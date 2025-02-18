/*
  Warnings:

  - You are about to drop the column `userId` on the `ChatMessage` table. All the data in the column will be lost.
  - Added the required column `fromUserId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toUserId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "userId",
ADD COLUMN     "fromUserId" TEXT NOT NULL,
ADD COLUMN     "toUserId" TEXT NOT NULL;
