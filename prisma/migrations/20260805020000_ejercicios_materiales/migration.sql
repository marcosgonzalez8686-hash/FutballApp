-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER,
    "explanation" TEXT,
    "imageUrl" TEXT,
    "imageUrl2" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseMaterial" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,

    CONSTRAINT "ExerciseMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingExercise" (
    "id" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "exerciseId" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "TrainingExercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseMaterial_exerciseId_materialId_key" ON "ExerciseMaterial"("exerciseId", "materialId");

-- AddForeignKey
ALTER TABLE "ExerciseMaterial" ADD CONSTRAINT "ExerciseMaterial_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseMaterial" ADD CONSTRAINT "ExerciseMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingExercise" ADD CONSTRAINT "TrainingExercise_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingExercise" ADD CONSTRAINT "TrainingExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Migrate existing free-text Training.exercise values into TrainingExercise as manual (non-catalog) entries
INSERT INTO "TrainingExercise" ("id", "trainingId", "exerciseId", "name")
SELECT substr(md5(random()::text || clock_timestamp()::text), 1, 25), "id", NULL, "exercise"
FROM "Training"
WHERE "exercise" IS NOT NULL AND "exercise" <> '';

-- AlterTable
ALTER TABLE "Training" DROP COLUMN "exercise";
