import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PlayerForm } from "@/components/PlayerForm";
import { DeleteButton } from "@/components/DeleteButton";
import {
  updatePlayer,
  addToSquad,
  removeFromSquad,
  deletePlayer,
} from "../actions";

export default async function BaseDatosJugadorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const player = await prisma.player.findUnique({ where: { id } });

  if (!player) notFound();

  const updatePlayerWithId = updatePlayer.bind(null, id);
  const addToSquadWithId = addToSquad.bind(null, id);
  const removeFromSquadWithId = removeFromSquad.bind(null, id);
  const deletePlayerWithId = deletePlayer.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">{player.name}</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <PlayerForm player={player} action={updatePlayerWithId} />
      </div>

      <div className="flex max-w-lg items-center justify-between">
        <div className="flex gap-3">
          <Link
            href="/base-datos/jugadores"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Volver
          </Link>
          <form action={deletePlayerWithId}>
            <DeleteButton
              label="Eliminar jugador"
              confirmMessage={`¿Eliminar definitivamente a ${player.name} de la base de datos? Esta acción no se puede deshacer.`}
            />
          </form>
        </div>

        {player.inSquad ? (
          <form action={removeFromSquadWithId}>
            <button type="submit" className="text-sm text-gray-400 hover:underline">
              Quitar de la plantilla
            </button>
          </form>
        ) : (
          <form action={addToSquadWithId}>
            <button type="submit" className="text-sm text-gray-400 hover:underline">
              Pasar a la plantilla
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
