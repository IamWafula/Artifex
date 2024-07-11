/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `RecommendedPost` will be added. If there are existing duplicate values, this will fail.
  - Made the column `postId` on table `RecommendedPost` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "RecommendedPost" ALTER COLUMN "postId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RecommendedPost_userId_postId_key" ON "RecommendedPost"("userId", "postId");
