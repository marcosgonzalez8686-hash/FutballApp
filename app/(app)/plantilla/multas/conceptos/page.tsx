import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteFineConcept } from "../actions";

export default async function ConceptosMultaPage() {
  const concepts = await prisma.fineConcept.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const groups = new Map<string, typeof concepts>();
  for (const concept of concepts) {
    const key = concept.category ?? "Otros";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(concept);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Conceptos de multa</h1>
        <Link
          href="/plantilla/multas/conceptos/nuevo"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Nuevo concepto
        </Link>
      </div>

      {concepts.length === 0 ? (
        <p className="text-sm text-gray-400">Todavía no hay conceptos de multa.</p>
      ) : (
        <div className="flex max-w-lg flex-col gap-6">
          {Array.from(groups.entries()).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-2">
              <h2 className="text-sm font-medium text-gray-500">{category}</h2>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                {items.map((concept) => {
                  const deleteWithId = deleteFineConcept.bind(null, concept.id);
                  return (
                    <div
                      key={concept.id}
                      className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 last:border-0"
                    >
                      <div>
                        <p className="text-sm text-gray-900">{concept.name}</p>
                        <p className="text-xs text-gray-500">
                          {concept.amount.toFixed(2)} €
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/plantilla/multas/conceptos/${concept.id}/editar`}
                          className="text-xs text-green-700 hover:underline"
                        >
                          Editar
                        </Link>
                        <form action={deleteWithId}>
                          <DeleteButton
                            label="Quitar"
                            confirmMessage={`¿Eliminar el concepto "${concept.name}"? Las multas que lo usaban quedarán sin concepto asignado.`}
                            variant="neutral"
                          />
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/plantilla/multas"
        className="max-w-lg rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Volver
      </Link>
    </div>
  );
}
