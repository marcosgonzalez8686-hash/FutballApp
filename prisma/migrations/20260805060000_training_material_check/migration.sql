-- CreateTable
CREATE TABLE "TrainingMaterialCheck" (
    "id" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "collected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TrainingMaterialCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainingMaterialCheck_trainingId_materialId_key" ON "TrainingMaterialCheck"("trainingId", "materialId");

-- AddForeignKey
ALTER TABLE "TrainingMaterialCheck" ADD CONSTRAINT "TrainingMaterialCheck_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingMaterialCheck" ADD CONSTRAINT "TrainingMaterialCheck_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
