import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FineForm } from "@/components/FineForm";
import { addMatchFine, deleteMatchFine } from "../../actions";

export default async function MultasPartidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [match, players, concepts, fines] = await Promise.all([
    prisma.match.findUnique({ where: { id } }),
    prisma.player.findMany({ where: { inSquad: true }, orderBy: { name: "asc" } }),
    prisma.fineConcept.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    prisma.fine.findMany({
      where: { matchId: id },
      include: { player: true, concept: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!match) notFound();

  const addFineWithId = addMatchFine.bind(null, id);
  const totalAmount = fines.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">Multas</h2>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-3 text-sm font-medium text-gray-500">Añadir multa</h3>
        <FineForm players={players} concepts={concepts} action={addFineWithId} />
      </div>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-3 text-sm font-medium text-gray-500">
          Multas de este partido
          {fines.length > 0 && ` (${totalAmount.toFixed(2)} €)`}
        </h3>
        {fines.length === 0 ? (
          <p className="text-sm text-gray-400">Todavía no hay multas.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {fines.map((fine) => {
              const deleteWithIds = deleteMatchFine.bind(null, fine.id, id);
              return (
                <li
                  key={fine.id}
                  className="flex items-center justify-between gap-4 rounded-md border border-gray-100 px-3 py-2"
                >
                  <div>
                    <p className="text-sm text-gray-900">
                      {fine.player.name} · {fine.amount.toFixed(2)} €
                    </p>
                    <p className="text-xs text-gray-400">
                      {fine.concept?.name ?? "Otro"}
                      {fine.comment && ` — ${fine.comment}`}
                    </p>
                  </div>
                  <form action={deleteWithIds}>
                    <button
                      type="submit"
                      className="text-xs text-gray-400 hover:underline"
                    >
                      Quitar
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
