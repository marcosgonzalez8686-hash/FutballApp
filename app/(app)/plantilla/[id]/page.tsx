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
  const player = await prisma.player.findUnique({ where: { id } });

  if (!player || !player.inSquad) notFound();

  const updatePlayerWithId = updatePlayer.bind(null, id);
  const removeFromSquadWithId = removeFromSquad.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">{player.name}</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <PlayerForm player={player} action={updatePlayerWithId} />
      </div>
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
