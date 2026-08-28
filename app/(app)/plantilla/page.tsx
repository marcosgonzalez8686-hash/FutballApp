import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PositionBadge } from "@/components/PositionBadge";

export default async function PlantillaPage() {
  const players = await prisma.player.findMany({
    where: { inSquad: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Plantilla</h1>
        <div className="flex gap-3">
          <Link
            href="/plantilla/multas"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Gestión de multas
          </Link>
          <Link
            href="/plantilla/nuevo"
            className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
          >
            Nuevo jugador
          </Link>
        </div>
      </div>

      {players.length === 0 ? (
        <p className="text-sm text-gray-400">Todavía no hay jugadores en la plantilla.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-2 font-medium">Nombre</th>
                <th className="px-4 py-2 font-medium">Posición</th>
                <th className="px-4 py-2 font-medium">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2">
                    <Link
                      href={`/plantilla/${player.id}`}
                      className="font-medium text-gray-900 hover:text-green-700"
                    >
                      {player.name}
                    </Link>
                    {player.nickname && (
                      <span className="ml-1 text-gray-400">
                        &ldquo;{player.nickname}&rdquo;
                      </span>
                    )}
                    {player.onTrial && (
                      <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                        A prueba
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <PositionBadge position={player.position} />
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {player.phone ?? "-"}
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
