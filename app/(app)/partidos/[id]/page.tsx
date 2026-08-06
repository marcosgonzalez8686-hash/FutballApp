import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
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

  const [match, calledCount] = await Promise.all([
    prisma.match.findUnique({ where: { id }, include: { rival: true } }),
    prisma.matchCallup.count({ where: { matchId: id, called: true } }),
  ]);

  if (!match) notFound();

  const deleteMatchWithId = deleteMatch.bind(null, id);

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
        <p className="text-sm text-gray-500">{calledCount} convocados</p>
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
          <p className="text-sm text-gray-500">Marcar jugadores convocados</p>
        </Link>
      </div>

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
