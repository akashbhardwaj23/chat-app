/*
  Warnings:

  - A unique constraint covering the columns `[roomId]` on the table `ChatMessage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChatMessage_roomId_key" ON "ChatMessage"("roomId");
