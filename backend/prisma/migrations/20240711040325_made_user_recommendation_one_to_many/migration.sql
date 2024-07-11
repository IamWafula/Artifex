/*
  Warnings:

  - You are about to drop the `_PostToRecommendedPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PostToRecommendedPost" DROP CONSTRAINT "_PostToRecommendedPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToRecommendedPost" DROP CONSTRAINT "_PostToRecommendedPost_B_fkey";

-- AlterTable
ALTER TABLE "RecommendedPost" ADD COLUMN     "postId" INTEGER;

-- DropTable
DROP TABLE "_PostToRecommendedPost";

-- AddForeignKey
ALTER TABLE "RecommendedPost" ADD CONSTRAINT "RecommendedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
