import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { displayName } from "@/lib/players";
import {
  moveLineupDoll,
  assignLineupPlayer,
  saveDefaultFormation,
} from "../../actions";
import { LineupBoard } from "./LineupBoard";

export default async function AlineacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const match = await prisma.match.findUnique({ where: { id } });
  if (!match) notFound();

  let lineupCount = await prisma.matchLineupSlot.count({ where: { matchId: id } });

  if (lineupCount === 0) {
    const defaultFormation = await prisma.defaultFormation.findUnique({
      where: { id: "default" },
    });
    if (defaultFormation && defaultFormation.slots.length > 0) {
      await prisma.matchLineupSlot.createMany({
        data: defaultFormation.slots.map((slotId) => ({
          matchId: id,
          slotId,
          playerId: null,
        })),
        skipDuplicates: true,
      });
      lineupCount = await prisma.matchLineupSlot.count({ where: { matchId: id } });
    }
  }

  const [slots, calledPlayers] = await Promise.all([
    prisma.matchLineupSlot.findMany({
      where: { matchId: id },
      include: { player: true },
    }),
    prisma.matchCallup.findMany({
      where: { matchId: id, called: true },
      include: { player: true },
      orderBy: { player: { name: "asc" } },
    }),
  ]);

  const moveDoll = moveLineupDoll.bind(null, id);
  const assignPlayer = assignLineupPlayer.bind(null, id);
  const saveDefault = saveDefaultFormation.bind(null, id);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-gray-500">Alineación</h2>

      <LineupBoard
        slots={slots.map((s) => ({
          slotId: s.slotId,
          playerId: s.playerId,
          playerName: s.player ? displayName(s.player) : null,
        }))}
        calledPlayers={calledPlayers.map((c) => ({
          id: c.player.id,
          displayName: displayName(c.player),
          position: c.player.position,
          secondaryPosition: c.player.secondaryPosition,
        }))}
        moveDoll={moveDoll}
        assignPlayer={assignPlayer}
        saveDefault={saveDefault}
      />

      <Link
        href={`/partidos/${id}`}
        className="max-w-lg rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Volver
      </Link>
    </div>
  );
}
