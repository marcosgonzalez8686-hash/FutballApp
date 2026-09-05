-- AlterTable
ALTER TABLE "Rival" ADD COLUMN "contact" TEXT,
ADD COLUMN "venue" TEXT,
ADD COLUMN "address" TEXT,
ADD COLUMN "phone" TEXT;

-- CreateTable
CREATE TABLE "Scouting" (
    "id" TEXT NOT NULL,
    "rivalId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "scoutName" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scouting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Scouting" ADD CONSTRAINT "Scouting_rivalId_fkey" FOREIGN KEY ("rivalId") REFERENCES "Rival"("id") ON DELETE CASCADE ON UPDATE CASCADE;
