/*
  Warnings:

  - You are about to drop the column `imageId` on the `Portfolio` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_imageId_fkey";

-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "imageId";

-- CreateTable
CREATE TABLE "_ImageToPortfolio" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ImageToPortfolio_AB_unique" ON "_ImageToPortfolio"("A", "B");

-- CreateIndex
CREATE INDEX "_ImageToPortfolio_B_index" ON "_ImageToPortfolio"("B");

-- AddForeignKey
ALTER TABLE "_ImageToPortfolio" ADD CONSTRAINT "_ImageToPortfolio_A_fkey" FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToPortfolio" ADD CONSTRAINT "_ImageToPortfolio_B_fkey" FOREIGN KEY ("B") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
