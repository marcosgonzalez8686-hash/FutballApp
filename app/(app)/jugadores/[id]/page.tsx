import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PlayerForm } from "../PlayerForm";
import { updatePlayer, deletePlayer } from "../actions";

export default async function JugadorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const player = await prisma.player.findUnique({ where: { id } });

  if (!player) notFound();

  const updatePlayerWithId = updatePlayer.bind(null, id);
  const deletePlayerWithId = deletePlayer.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">{player.name}</h1>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <PlayerForm player={player} action={updatePlayerWithId} />
      </div>
      <form action={deletePlayerWithId} className="max-w-lg">
        <button
          type="submit"
          className="text-sm text-red-600 hover:underline"
        >
          Eliminar jugador
        </button>
      </form>
    </div>
  );
}
