import { toDateInputValue } from "@/lib/format";
import { PLAYER_POSITIONS } from "@/lib/positions";
import type { Player } from "@/app/generated/prisma/client";

export function PlayerForm({
  player,
  action,
}: {
  player?: Player;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={player?.name}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
          Apodo
        </label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          defaultValue={player?.nickname ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Posición
          </label>
          <select
            id="position"
            name="position"
            defaultValue={player?.position ?? ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          >
            <option value="">Sin especificar</option>
            {PLAYER_POSITIONS.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="secondaryPosition"
            className="block text-sm font-medium text-gray-700"
          >
            Posición secundaria
          </label>
          <select
            id="secondaryPosition"
            name="secondaryPosition"
            defaultValue={player?.secondaryPosition ?? ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          >
            <option value="">Sin especificar</option>
            {PLAYER_POSITIONS.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
            Fecha de nacimiento
          </label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            defaultValue={player?.birthDate ? toDateInputValue(player.birthDate) : ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="dominantFoot" className="block text-sm font-medium text-gray-700">
            Pie dominante
          </label>
          <select
            id="dominantFoot"
            name="dominantFoot"
            defaultValue={player?.dominantFoot ?? ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          >
            <option value="">Sin especificar</option>
            <option value="IZQUIERDO">Izquierdo</option>
            <option value="DERECHO">Derecho</option>
            <option value="AMBOS">Ambos</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={player?.phone ?? ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="club" className="block text-sm font-medium text-gray-700">
            Club
          </label>
          <input
            id="club"
            name="club"
            type="text"
            defaultValue={player?.club ?? ""}
            placeholder="Vacío si es de tu club"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="onTrial"
          defaultChecked={player?.onTrial ?? false}
          className="h-4 w-4 rounded border-gray-300"
        />
        Jugador a prueba
      </label>

      <button
        type="submit"
        className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
      >
        Guardar
      </button>
    </form>
  );
}
