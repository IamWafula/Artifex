/*
  Warnings:

  - You are about to drop the column `userId` on the `PostLike` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostLike" DROP CONSTRAINT "PostLike_userId_fkey";

-- AlterTable
ALTER TABLE "PostLike" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_PostLikeToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostLikeToUser_AB_unique" ON "_PostLikeToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PostLikeToUser_B_index" ON "_PostLikeToUser"("B");

-- AddForeignKey
ALTER TABLE "_PostLikeToUser" ADD CONSTRAINT "_PostLikeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "PostLike"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostLikeToUser" ADD CONSTRAINT "_PostLikeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
