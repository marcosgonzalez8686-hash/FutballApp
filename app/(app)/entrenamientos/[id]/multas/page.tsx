import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FineForm } from "@/components/FineForm";
import { AUTO_FINE_CONCEPT_BY_STATUS } from "@/lib/fines";
import { addTrainingFine, deleteTrainingFine } from "../../actions";

export default async function MultasEntrenamientoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [training, players, concepts, fines] = await Promise.all([
    prisma.training.findUnique({
      where: { id },
      include: { attendances: { include: { player: true } } },
    }),
    prisma.player.findMany({ where: { inSquad: true }, orderBy: { name: "asc" } }),
    prisma.fineConcept.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    prisma.fine.findMany({
      where: { trainingId: id },
      include: { player: true, concept: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!training) notFound();

  const conceptById = new Map(concepts.map((c) => [c.id, c]));

  const finedPlayerConcepts = new Set(
    fines.filter((f) => f.conceptId).map((f) => `${f.playerId}-${f.conceptId}`)
  );

  const candidates = training.attendances
    .filter((a) => a.status === "AUSENCIA_NO_JUSTIFICADA" || a.status === "TARDE")
    .map((a) => ({
      player: a.player,
      conceptId: AUTO_FINE_CONCEPT_BY_STATUS[a.status],
    }))
    .filter((c) => conceptById.has(c.conceptId))
    .filter((c) => !finedPlayerConcepts.has(`${c.player.id}-${c.conceptId}`));

  const addFineWithId = addTrainingFine.bind(null, id);
  const totalAmount = fines.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">Multas</h2>

      {candidates.length > 0 && (
        <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-3 text-sm font-medium text-gray-500">
            Jugadores con incidencia en esta sesión
          </h3>
          <ul className="flex flex-col gap-2">
            {candidates.map((c) => {
              const concept = conceptById.get(c.conceptId)!;
              return (
                <li
                  key={`${c.player.id}-${c.conceptId}`}
                  className="flex items-center justify-between gap-4 rounded-md border border-gray-100 px-3 py-2"
                >
                  <span className="text-sm text-gray-900">
                    {c.player.name}{" "}
                    <span className="text-xs text-gray-400">({concept.name})</span>
                  </span>
                  <form action={addFineWithId} className="flex items-center gap-2">
                    <input type="hidden" name="playerId" value={c.player.id} />
                    <input type="hidden" name="conceptId" value={c.conceptId} />
                    <input
                      type="number"
                      name="amount"
                      step="0.01"
                      min={0}
                      required
                      defaultValue={concept.amount}
                      placeholder="€"
                      className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-green-600 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-green-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-800"
                    >
                      Multar
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-3 text-sm font-medium text-gray-500">Añadir multa</h3>
        <FineForm players={players} concepts={concepts} action={addFineWithId} />
      </div>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-3 text-sm font-medium text-gray-500">
          Multas de esta sesión
          {fines.length > 0 && ` (${totalAmount.toFixed(2)} €)`}
        </h3>
        {fines.length === 0 ? (
          <p className="text-sm text-gray-400">Todavía no hay multas.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {fines.map((fine) => {
              const deleteWithIds = deleteTrainingFine.bind(null, fine.id, id);
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
