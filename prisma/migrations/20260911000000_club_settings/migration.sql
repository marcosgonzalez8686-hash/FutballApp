-- CreateTable
CREATE TABLE "ClubSettings" (
    "id" TEXT NOT NULL,
    "venue" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubSettings_pkey" PRIMARY KEY ("id")
);
