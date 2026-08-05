-- AlterTable
ALTER TABLE "Player" ADD COLUMN "club" TEXT;
ALTER TABLE "Player" ADD COLUMN "inSquad" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Coach" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "club" TEXT,
    "formation" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referee_pkey" PRIMARY KEY ("id")
);
