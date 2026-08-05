-- CreateEnum
CREATE TYPE "Competition" AS ENUM ('AMISTOSO', 'LIGA', 'COPA');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN "competition" "Competition" NOT NULL DEFAULT 'LIGA';

-- CreateTable
CREATE TABLE "MatchCallup" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "called" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MatchCallup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchCallup_matchId_playerId_key" ON "MatchCallup"("matchId", "playerId");

-- AddForeignKey
ALTER TABLE "MatchCallup" ADD CONSTRAINT "MatchCallup_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchCallup" ADD CONSTRAINT "MatchCallup_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
