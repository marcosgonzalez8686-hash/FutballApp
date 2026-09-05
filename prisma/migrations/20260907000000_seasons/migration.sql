-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- Seed: temporada inicial vigente
INSERT INTO "Season" (id, name, "isCurrent") VALUES ('season-2026-2027', '2026/2027', true);

-- AlterTable Training: nueva columna seasonId, con backfill a la temporada inicial
ALTER TABLE "Training" ADD COLUMN "seasonId" TEXT;
UPDATE "Training" SET "seasonId" = 'season-2026-2027';
ALTER TABLE "Training" ALTER COLUMN "seasonId" SET NOT NULL;

-- AlterTable Match: nueva columna seasonId, con backfill a la temporada inicial
ALTER TABLE "Match" ADD COLUMN "seasonId" TEXT;
UPDATE "Match" SET "seasonId" = 'season-2026-2027';
ALTER TABLE "Match" ALTER COLUMN "seasonId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Training" ADD CONSTRAINT "Training_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
