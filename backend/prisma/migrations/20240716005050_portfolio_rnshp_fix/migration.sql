/*
  Warnings:

  - You are about to drop the column `portfolioId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the `_BidToPortfolio` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bidId` to the `Portfolio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageId` to the `Portfolio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "_BidToPortfolio" DROP CONSTRAINT "_BidToPortfolio_A_fkey";

-- DropForeignKey
ALTER TABLE "_BidToPortfolio" DROP CONSTRAINT "_BidToPortfolio_B_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "portfolioId";

-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "bidId" INTEGER NOT NULL,
ADD COLUMN     "imageId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_BidToPortfolio";

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "Bid"("id") ON DELETE CASCADE ON UPDATE CASCADE;
