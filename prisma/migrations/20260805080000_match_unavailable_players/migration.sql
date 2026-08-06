-- AlterTable: remove general Player.available (replaced by per-match unavailability)
ALTER TABLE "Player" DROP COLUMN "available";

-- AlterTable: add per-match unavailability flag
ALTER TABLE "MatchCallup" ADD COLUMN "unavailable" BOOLEAN NOT NULL DEFAULT false;
