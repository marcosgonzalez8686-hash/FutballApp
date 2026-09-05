import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateFineConcept } from "../../../actions";
import { ConceptForm } from "../../ConceptForm";

export default async function EditarConceptoPage({
  params,
}: {
  params: Promise<{ conceptId: string }>;
}) {
  const { conceptId } = await params;
  const concept = await prisma.fineConcept.findUnique({ where: { id: conceptId } });

  if (!concept) notFound();

  const updateWithId = updateFineConcept.bind(null, conceptId);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Editar concepto de multa</h1>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <ConceptForm concept={concept} action={updateWithId} />
      </div>

      <Link
        href="/plantilla/multas/conceptos"
        className="max-w-lg rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Volver
      </Link>
    </div>
  );
}
