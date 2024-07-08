/*
  Warnings:

  - You are about to drop the column `category` on the `Commission` table. All the data in the column will be lost.
  - You are about to drop the column `datePublished` on the `Commission` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Commission` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Commission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Commission" DROP COLUMN "category",
DROP COLUMN "datePublished",
DROP COLUMN "description",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "category" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "datePublished" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';
