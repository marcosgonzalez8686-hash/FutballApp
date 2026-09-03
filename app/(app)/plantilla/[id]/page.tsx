import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PlayerForm } from "@/components/PlayerForm";
import { DeleteButton } from "@/components/DeleteButton";
import { updatePlayer, removeFromSquad } from "../actions";

export default async function JugadorPlantillaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [player, eventCounts] = await Promise.all([
    prisma.player.findUnique({ where: { id } }),
    prisma.matchEvent.groupBy({
      by: ["type"],
      where: { playerId: id },
      _count: true,
    }),
  ]);

  if (!player || !player.inSquad) notFound();

  const countFor = (type: (typeof eventCounts)[number]["type"]) =>
    eventCounts.find((e) => e.type === type)?._count ?? 0;

  const updatePlayerWithId = updatePlayer.bind(null, id);
  const removeFromSquadWithId = removeFromSquad.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">{player.name}</h1>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-3 text-sm font-medium text-gray-500">Estadísticas en partidos</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-gray-900">{countFor("GOL")}</p>
            <p className="text-xs text-gray-500">Goles</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{countFor("ASISTENCIA")}</p>
            <p className="text-xs text-gray-500">Asistencias</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{countFor("TARJETA_AMARILLA")}</p>
            <p className="text-xs text-gray-500">Tarjetas amarillas</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{countFor("TARJETA_ROJA")}</p>
            <p className="text-xs text-gray-500">Tarjetas rojas</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <PlayerForm player={player} action={updatePlayerWithId} />
      </div>
      <Link
        href={`/listados/asistencia?playerId=${player.id}`}
        className="max-w-lg text-sm text-green-700 hover:underline"
      >
        Ver asistencia a entrenamientos →
      </Link>
      <div className="flex max-w-lg gap-3">
        <Link
          href="/plantilla"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Volver
        </Link>
        <form action={removeFromSquadWithId}>
          <DeleteButton
            label="Quitar de la plantilla"
            confirmMessage={`¿Quitar a ${player.name} de la plantilla? Seguirá disponible en Base de datos.`}
            variant="neutral"
          />
        </form>
      </div>
    </div>
  );
}
