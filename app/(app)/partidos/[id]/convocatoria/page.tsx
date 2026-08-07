import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getWeekRange } from "@/lib/format";
import { ConvocatoriaForm } from "./ConvocatoriaForm";
import { saveCallups } from "../../actions";

export default async function ConvocatoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const match = await prisma.match.findUnique({
    where: { id },
    include: { callups: true },
  });

  if (!match) notFound();

  const players = await prisma.player.findMany({
    where: {
      inSquad: true,
      ...(match.competition === "LIGA" ? { onTrial: false } : {}),
    },
    orderBy: { name: "asc" },
  });

  const { start, end } = getWeekRange(match.date);
  const weekTrainings = await prisma.training.findMany({
    where: { date: { gte: start, lt: end } },
    include: { attendances: true },
  });

  function weeklyAttendanceFor(playerId: string) {
    if (weekTrainings.length === 0) return null;
    const attended = weekTrainings.filter((training) =>
      training.attendances.some(
        (a) =>
          a.playerId === playerId &&
          (a.status === "CONFIRMADO" || a.status === "TARDE")
      )
    ).length;
    return { attended, total: weekTrainings.length };
  }

  const callupByPlayer = new Map(match.callups.map((c) => [c.playerId, c]));

  const selectablePlayers = players.filter(
    (player) => !callupByPlayer.get(player.id)?.unavailable
  );
  const unavailablePlayers = players.filter(
    (player) => callupByPlayer.get(player.id)?.unavailable
  );

  const playersWithCalled = selectablePlayers.map((player) => ({
    id: player.id,
    name: player.name,
    called: callupByPlayer.get(player.id)?.called ?? false,
    weeklyAttendance: weeklyAttendanceFor(player.id),
  }));

  const saveCallupsWithId = saveCallups.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">Convocatoria</h2>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        {selectablePlayers.length === 0 ? (
          <p className="text-sm text-gray-400">
            No hay jugadores disponibles para convocar.
          </p>
        ) : (
          <ConvocatoriaForm
            players={playersWithCalled}
            action={saveCallupsWithId}
          />
        )}
      </div>

      {unavailablePlayers.length > 0 && (
        <div className="max-w-lg rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            No disponibles para este partido
          </h3>
          <ul className="flex flex-col gap-1">
            {unavailablePlayers.map((player) => (
              <li key={player.id} className="text-sm text-gray-400">
                {player.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
