-- AlterTable
ALTER TABLE "TrainingExercise" ADD COLUMN "duration" INTEGER;

-- Backfill: snapshot the catalog exercise's duration into existing rows
UPDATE "TrainingExercise" te
SET "duration" = e."duration"
FROM "Exercise" e
WHERE te."exerciseId" = e."id" AND e."duration" IS NOT NULL;
