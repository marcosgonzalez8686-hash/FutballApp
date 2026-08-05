-- Replace AttendanceStatus enum values (CONFIRMADO/AUSENTE/PENDIENTE ->
-- CONFIRMADO/AUSENCIA_JUSTIFICADA/AUSENCIA_NO_JUSTIFICADA/TARDE)
CREATE TYPE "AttendanceStatus_new" AS ENUM ('CONFIRMADO', 'AUSENCIA_JUSTIFICADA', 'AUSENCIA_NO_JUSTIFICADA', 'TARDE');

ALTER TABLE "TrainingAttendance" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "TrainingAttendance"
  ALTER COLUMN "status" TYPE "AttendanceStatus_new"
  USING (
    CASE "status"::text
      WHEN 'AUSENTE' THEN 'AUSENCIA_NO_JUSTIFICADA'
      WHEN 'PENDIENTE' THEN 'CONFIRMADO'
      ELSE "status"::text
    END
  )::"AttendanceStatus_new";

DROP TYPE "AttendanceStatus";
ALTER TYPE "AttendanceStatus_new" RENAME TO "AttendanceStatus";

ALTER TABLE "TrainingAttendance" ALTER COLUMN "status" SET DEFAULT 'CONFIRMADO';
