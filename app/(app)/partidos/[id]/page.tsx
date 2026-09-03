import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatHourMinute, formatWeekdayDayMonth } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteMatch } from "../actions";

const competitionLabels = {
  AMISTOSO: "Amistoso",
  LIGA: "Liga",
  COPA: "Copa",
};

const statusLabels = {
  PROGRAMADO: "Programado",
  JUGADO: "Jugado",
  CANCELADO: "Cancelado",
};

export default async function PartidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [match, calledPlayers, unavailableCount, fineTotal, eventCount] = await Promise.all([
    prisma.match.findUnique({ where: { id }, include: { rival: true } }),
    prisma.matchCallup.findMany({
      where: { matchId: id, called: true },
      include: { player: true },
    }),
    prisma.matchCallup.count({ where: { matchId: id, unavailable: true } }),
    prisma.fine.aggregate({
      where: { matchId: id },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.matchEvent.count({ where: { matchId: id } }),
  ]);

  if (!match) notFound();

  calledPlayers.sort((a, b) => a.player.name.localeCompare(b.player.name));
  const calledCount = calledPlayers.length;

  const deleteMatchWithId = deleteMatch.bind(null, id);

  let whatsappUrl: string | null = null;
  if (calledCount > 0) {
    const arrivalTime = new Date(match.date.getTime() - 60 * 60 * 1000);
    const lines = [
      `CONVOCATORIA (${match.competition})`,
      `${match.isHome ? "VS" : "@"} ${match.rival.name}`,
      `${formatWeekdayDayMonth(match.date)}.`,
      `Hora de partido: ${formatHourMinute(match.date)}`,
      `Hora en el campo: ${formatHourMinute(arrivalTime)}`,
      "",
      `Convocados (${calledCount}):`,
      ...calledPlayers.map((c, i) => `${i + 1}. ${c.player.name}`),
    ];
    whatsappUrl = `https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {match.isHome ? "vs" : "@"} {match.rival.name}
        </h2>
        <p className="text-sm text-gray-500">
          {formatDateTime(match.date)} · {competitionLabels[match.competition]} ·{" "}
          {statusLabels[match.status]}
          {match.status === "JUGADO" &&
            match.ourScore !== null &&
            match.rivalScore !== null &&
            ` · ${match.ourScore} - ${match.rivalScore}`}
        </p>
        {unavailableCount > 0 && (
          <p className="text-sm text-gray-500">
            {unavailableCount} no disponibles
          </p>
        )}
        {match.notes && <p className="mt-1 text-sm text-gray-500">{match.notes}</p>}
      </div>

      <div className="grid max-w-lg gap-3 sm:grid-cols-2">
        <Link
          href={`/partidos/${id}/editar`}
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Editar</p>
          <p className="text-sm text-gray-500">Rival, fecha, resultado...</p>
        </Link>
        <Link
          href={`/partidos/${id}/convocatoria`}
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Convocatoria</p>
          <p className="text-sm text-gray-500">{calledCount} convocados</p>
        </Link>
        <Link
          href={`/partidos/${id}/no-disponibles`}
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">No disponibles</p>
          <p className="text-sm text-gray-500">
            Quién no puede ir a este partido
          </p>
        </Link>
        <Link
          href={`/partidos/${id}/multas`}
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Multas</p>
          <p className="text-sm text-gray-500">
            {fineTotal._count > 0
              ? `${fineTotal._count} · ${(fineTotal._sum.amount ?? 0).toFixed(2)} €`
              : "Sin multas"}
          </p>
        </Link>
        <Link
          href={`/partidos/${id}/eventos`}
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Eventos</p>
          <p className="text-sm text-gray-500">
            {eventCount > 0 ? `${eventCount} registrados` : "Goles, asistencias, tarjetas"}
          </p>
        </Link>
      </div>

      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-lg items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Enviar convocatoria por WhatsApp
        </a>
      )}

      <div className="flex max-w-lg gap-3">
        <Link
          href="/partidos"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Volver
        </Link>
        <form action={deleteMatchWithId}>
          <DeleteButton
            label="Eliminar partido"
            confirmMessage="¿Eliminar este partido? Se borrará también su convocatoria. Esta acción no se puede deshacer."
          />
        </form>
      </div>
    </div>
  );
}
