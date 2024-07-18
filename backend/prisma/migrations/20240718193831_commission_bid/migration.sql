/*
  Warnings:

  - A unique constraint covering the columns `[commissionId]` on the table `Bid` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bid_commissionId_key" ON "Bid"("commissionId");
