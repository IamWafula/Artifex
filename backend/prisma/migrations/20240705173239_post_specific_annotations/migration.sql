/*
  Warnings:

  - Added the required column `description` to the `Bid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Commission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Commission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Commission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Annotation" ADD COLUMN     "postId" INTEGER;

-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Commission" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "datePublished" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
