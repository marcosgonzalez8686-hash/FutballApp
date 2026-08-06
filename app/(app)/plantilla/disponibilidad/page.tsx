import { prisma } from "@/lib/prisma";
import { AutoSubmitCheckbox } from "@/components/AutoSubmitCheckbox";
import { toggleAvailability } from "../actions";

export default async function DisponibilidadPage() {
  const players = await prisma.player.findMany({
    where: { inSquad: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-medium text-gray-500">Disponibilidad</h2>
        <p className="text-sm text-gray-400">
          Marca a los jugadores que no están disponibles para los próximos
          partidos. No aparecerán en la convocatoria.
        </p>
      </div>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        {players.length === 0 ? (
          <p className="text-sm text-gray-400">
            Todavía no hay jugadores en la plantilla.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {players.map((player) => {
              const toggleWithId = toggleAvailability.bind(null, player.id);
              return (
                <li
                  key={player.id}
                  className="flex items-center justify-between gap-4 rounded-md border border-gray-100 px-3 py-2"
                >
                  <span className="text-sm text-gray-900">{player.name}</span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    No disponible
                    <AutoSubmitCheckbox
                      name="unavailable"
                      defaultChecked={!player.available}
                      action={toggleWithId}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
