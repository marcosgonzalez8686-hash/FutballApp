import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addMatchEvent, deleteMatchEvent } from "../../actions";

const eventLabels = {
  GOL: "Gol",
  ASISTENCIA: "Asistencia",
  TARJETA_AMARILLA: "Tarjeta amarilla",
  TARJETA_ROJA: "Tarjeta roja",
};

export default async function EventosPartidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [match, calledPlayers, events] = await Promise.all([
    prisma.match.findUnique({ where: { id } }),
    prisma.matchCallup.findMany({
      where: { matchId: id, called: true },
      include: { player: true },
      orderBy: { player: { name: "asc" } },
    }),
    prisma.matchEvent.findMany({
      where: { matchId: id },
      include: { player: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!match) notFound();

  const addEventWithId = addMatchEvent.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">Eventos</h2>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-3 text-sm font-medium text-gray-500">Añadir evento</h3>
        {calledPlayers.length === 0 ? (
          <p className="text-sm text-gray-400">
            No hay jugadores convocados para este partido.
          </p>
        ) : (
          <form action={addEventWithId} className="flex flex-col gap-4">
            <div>
              <label htmlFor="playerId" className="block text-sm font-medium text-gray-700">
                Jugador *
              </label>
              <select
                id="playerId"
                name="playerId"
                required
                defaultValue=""
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
              >
                <option value="" disabled>
                  Selecciona un jugador
                </option>
                {calledPlayers.map((c) => (
                  <option key={c.playerId} value={c.playerId}>
                    {c.player.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Evento *
              </label>
              <select
                id="type"
                name="type"
                required
                defaultValue="GOL"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
              >
                <option value="GOL">Gol</option>
                <option value="ASISTENCIA">Asistencia</option>
                <option value="TARJETA_AMARILLA">Tarjeta amarilla</option>
                <option value="TARJETA_ROJA">Tarjeta roja</option>
              </select>
            </div>

            <button
              type="submit"
              className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
            >
              Añadir evento
            </button>
          </form>
        )}
      </div>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-3 text-sm font-medium text-gray-500">
          Eventos de este partido
        </h3>
        {events.length === 0 ? (
          <p className="text-sm text-gray-400">Todavía no hay eventos.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {events.map((event) => {
              const deleteWithIds = deleteMatchEvent.bind(null, event.id, id);
              return (
                <li
                  key={event.id}
                  className="flex items-center justify-between gap-4 rounded-md border border-gray-100 px-3 py-2"
                >
                  <p className="text-sm text-gray-900">
                    {event.player.name} · {eventLabels[event.type]}
                  </p>
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
