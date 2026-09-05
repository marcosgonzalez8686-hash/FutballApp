-- CreateTable
CREATE TABLE "FineConcept" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FineConcept_pkey" PRIMARY KEY ("id")
);

-- Seed: catálogo de conceptos de multa (AD Lavadores 26/27)
INSERT INTO "FineConcept" (id, name, category, amount) VALUES
('tarde-entreno', 'Llegar tarde al entrenamiento', 'Puntualidad y Asistencia', 1),
('tarde-partido', 'Llegar tarde el día del partido', 'Puntualidad y Asistencia', 3),
('falta-aviso-entreno', 'Faltar o llegar tarde a un entrenamiento sin avisar con antelación suficiente', 'Puntualidad y Asistencia', 2),
('falta-aviso-partido', 'Faltar o llegar tarde a un partido sin avisar con antelación suficiente', 'Puntualidad y Asistencia', 5),
('falta-injustificada-partido', 'Faltar a un partido sin causa justificada', 'Puntualidad y Asistencia', 10),
('material-olvidado', 'Olvidar material obligatorio (por prenda)', 'Indumentaria y Material', 1),
('no-ropa-club', 'No entrenar con la ropa del club (fichas definitivas)', 'Indumentaria y Material', 1),
('dejar-prenda-vestuario', 'Dejarse algo en el vestuario', 'Indumentaria y Material', 1),
('complementos', 'Entrenar con complementos (pendientes, relojes...)', 'Indumentaria y Material', 1),
('no-recoger-material', 'No recoger el material colectivo', 'Indumentaria y Material', 1),
('balon-fuera', 'Tirar el balón fuera del campo', 'Indumentaria y Material', 1),
('amarilla-protesta', 'Tarjeta amarilla por protesta o falta de respeto al árbitro', 'Disciplina en el campo', 5),
('roja-agresion', 'Tarjeta roja por agresión, insultos o autoexpulsión', 'Disciplina en el campo', 10),
('falta-respeto', 'Faltar al respeto a un compañero, al cuerpo técnico o a cualquier persona del club', 'Disciplina en el campo', 5),
('fumar', 'Fumar en el recinto deportivo', 'Disciplina en el campo', 5),
('movil-vestuario', 'Sonar el móvil en el vestuario', 'Convivencia y Vestuario', 1),
('vestuario-sucio', 'Dejar el vestuario sucio', 'Convivencia y Vestuario', 1),
('salir-antes-charla', 'Irse antes de que termine de hablar el cuerpo técnico', 'Convivencia y Vestuario', 1),
('faltar-evento', 'No acudir a cenas o eventos de equipo sin causa justificada', 'Eventos y Tercer Tiempo', 1),
('cumple-sin-pinchos', 'No traer pinchos/aperitivos por cumpleaños', 'Eventos y Tercer Tiempo', 1);

-- AlterTable: nueva columna conceptId en Fine
ALTER TABLE "Fine" ADD COLUMN "conceptId" TEXT;

-- Migrar multas existentes: mapear el antiguo "reason" al concepto equivalente
UPDATE "Fine" SET "conceptId" = CASE
  WHEN "reason" = 'TARDE' THEN 'tarde-entreno'
  WHEN "reason" = 'AUSENCIA_NO_JUSTIFICADA' THEN 'falta-aviso-entreno'
  ELSE NULL
END;

-- Eliminar la columna y el enum antiguos
ALTER TABLE "Fine" DROP COLUMN "reason";
DROP TYPE "FineReason";

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "FineConcept"("id") ON DELETE SET NULL ON UPDATE CASCADE;
