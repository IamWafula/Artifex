-- CreateTable
CREATE TABLE "RecommendationRun" (
    "id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationRun_pkey" PRIMARY KEY ("id")
);
