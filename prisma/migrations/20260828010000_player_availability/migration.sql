-- CreateEnum
CREATE TYPE "PlayerAvailability" AS ENUM ('DISPONIBLE', 'LESIONADO', 'SANCIONADO');

-- AlterTable
ALTER TABLE "Player" ADD COLUMN "availability" "PlayerAvailability" NOT NULL DEFAULT 'DISPONIBLE';
