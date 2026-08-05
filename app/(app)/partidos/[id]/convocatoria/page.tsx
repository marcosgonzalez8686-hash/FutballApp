import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ConvocatoriaForm } from "./ConvocatoriaForm";
import { saveCallups } from "../../actions";

export default async function ConvocatoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [match, players] = await Promise.all([
    prisma.match.findUnique({
      where: { id },
      include: { callups: true },
    }),
    prisma.player.findMany({
      where: { inSquad: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!match) notFound();

  const calledByPlayer = new Map(
    match.callups.map((c) => [c.playerId, c.called])
  );

  const playersWithCalled = players.map((player) => ({
    id: player.id,
    name: player.name,
    called: calledByPlayer.get(player.id) ?? false,
  }));

  const saveCallupsWithId = saveCallups.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">Convocatoria</h2>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        {players.length === 0 ? (
          <p className="text-sm text-gray-400">No hay jugadores en la plantilla.</p>
        ) : (
          <ConvocatoriaForm
            players={playersWithCalled}
            action={saveCallupsWithId}
          />
        )}
      </div>
    </div>
  );
}
