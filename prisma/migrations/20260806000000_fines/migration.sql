-- CreateEnum
CREATE TYPE "FineReason" AS ENUM ('TARDE', 'AUSENCIA_NO_JUSTIFICADA', 'OTROS');

-- CreateTable
CREATE TABLE "Fine" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "trainingId" TEXT,
    "matchId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" "FineReason" NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
