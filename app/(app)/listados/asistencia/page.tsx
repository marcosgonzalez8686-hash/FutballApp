import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

const statusLabels = {
  CONFIRMADO: "Confirmado",
  AUSENCIA_JUSTIFICADA: "Ausencia justificada",
  AUSENCIA_NO_JUSTIFICADA: "Ausencia no justificada",
  TARDE: "Llega tarde",
};

export default async function AsistenciaListadoPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; playerId?: string }>;
}) {
  const { from, to, playerId } = await searchParams;

  const dateFilter: { gte?: Date; lt?: Date } = {};
  if (from) dateFilter.gte = new Date(from);
  if (to) dateFilter.lt = new Date(new Date(to).getTime() + 24 * 60 * 60 * 1000);

  const [records, player] = await Promise.all([
    prisma.trainingAttendance.findMany({
      where: {
        ...(playerId ? { playerId } : {}),
        ...(from || to ? { training: { date: dateFilter } } : {}),
      },
      include: { training: true, player: true },
      orderBy: { training: { date: "desc" } },
    }),
    playerId
      ? prisma.player.findUnique({ where: { id: playerId } })
      : Promise.resolve(null),
  ]);

  const hasFilters = Boolean(from || to);
  const clearFiltersHref = playerId ? `?playerId=${playerId}` : "?";

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">
        {player ? `Asistencia de ${player.name}` : "Asistencia a entrenamientos"}
      </h2>

      <form method="GET" className="flex flex-wrap items-end gap-3">
        {playerId && <input type="hidden" name="playerId" value={playerId} />}
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700">
            Desde
          </label>
          <input
            id="from"
            name="from"
            type="date"
            defaultValue={from ?? ""}
            className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700">
            Hasta
          </label>
          <input
            id="to"
            name="to"
            type="date"
            defaultValue={to ?? ""}
            className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Filtrar
        </button>
        {hasFilters && (
          <Link
            href={clearFiltersHref}
            className="text-sm text-gray-500 hover:underline"
          >
            Quitar filtros
          </Link>
        )}
      </form>

      {records.length === 0 ? (
        <p className="text-sm text-gray-400">
          No hay registros de asistencia para este filtro.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-2 font-medium">Fecha</th>
                {!playerId && <th className="px-4 py-2 font-medium">Jugador</th>}
                <th className="px-4 py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2 text-gray-900">
                    {formatDate(record.training.date)}
                  </td>
                  {!playerId && (
                    <td className="px-4 py-2 text-gray-600">
                      {record.player.name}
                    </td>
                  )}
                  <td className="px-4 py-2 text-gray-600">
                    {statusLabels[record.status]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
