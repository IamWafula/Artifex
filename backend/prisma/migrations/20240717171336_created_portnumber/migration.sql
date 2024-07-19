/*
  Warnings:

  - You are about to drop the column `portNum` on the `Portfolio` table. All the data in the column will be lost.
  - Added the required column `portfolioNumber` to the `Portfolio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "portNum",
ADD COLUMN     "portfolioNumber" INTEGER NOT NULL;
