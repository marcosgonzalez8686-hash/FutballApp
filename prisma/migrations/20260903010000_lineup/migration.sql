-- CreateTable
CREATE TABLE "MatchLineupSlot" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "playerId" TEXT,

    CONSTRAINT "MatchLineupSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultFormation" (
    "id" TEXT NOT NULL,
    "slots" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DefaultFormation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchLineupSlot_matchId_slotId_key" ON "MatchLineupSlot"("matchId", "slotId");

-- AddForeignKey
ALTER TABLE "MatchLineupSlot" ADD CONSTRAINT "MatchLineupSlot_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchLineupSlot" ADD CONSTRAINT "MatchLineupSlot_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
