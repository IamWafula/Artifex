-- CreateTable
CREATE TABLE "RecommendedPost" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RecommendedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostToRecommendedPost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostToRecommendedPost_AB_unique" ON "_PostToRecommendedPost"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToRecommendedPost_B_index" ON "_PostToRecommendedPost"("B");

-- AddForeignKey
ALTER TABLE "RecommendedPost" ADD CONSTRAINT "RecommendedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToRecommendedPost" ADD CONSTRAINT "_PostToRecommendedPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToRecommendedPost" ADD CONSTRAINT "_PostToRecommendedPost_B_fkey" FOREIGN KEY ("B") REFERENCES "RecommendedPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
