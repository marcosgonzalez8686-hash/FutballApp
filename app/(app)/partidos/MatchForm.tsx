import { toDateTimeLocalValue } from "@/lib/format";
import type { Match, Rival } from "@/app/generated/prisma/client";

export function MatchForm({
  match,
  rivals,
  action,
}: {
  match?: Match;
  rivals: Rival[];
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="rivalId" className="block text-sm font-medium text-gray-700">
          Rival *
        </label>
        <select
          id="rivalId"
          name="rivalId"
          required
          defaultValue={match?.rivalId ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        >
          <option value="" disabled>
            Selecciona un rival
          </option>
          {rivals.map((rival) => (
            <option key={rival.id} value={rival.id}>
              {rival.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Fecha y hora *
        </label>
        <input
          id="date"
          name="date"
          type="datetime-local"
          required
          defaultValue={match?.date ? toDateTimeLocalValue(match.date) : ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-gray-700">
          Condición
        </legend>
        <div className="mt-1 flex gap-4 text-sm text-gray-700">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="isHome"
              value="true"
              defaultChecked={match ? match.isHome : true}
            />
            Local
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="isHome"
              value="false"
              defaultChecked={match ? !match.isHome : false}
            />
            Visitante
          </label>
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="ourScore" className="block text-sm font-medium text-gray-700">
            Goles propios
          </label>
          <input
            id="ourScore"
            name="ourScore"
            type="number"
            min={0}
            defaultValue={match?.ourScore ?? ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="rivalScore" className="block text-sm font-medium text-gray-700">
            Goles rival
          </label>
          <input
            id="rivalScore"
            name="rivalScore"
            type="number"
            min={0}
            defaultValue={match?.rivalScore ?? ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Estado
        </label>
        <select
          id="status"
          name="status"
          defaultValue={match?.status ?? "PROGRAMADO"}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        >
          <option value="PROGRAMADO">Programado</option>
          <option value="JUGADO">Jugado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notas
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={match?.notes ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
      >
        Guardar
      </button>
    </form>
  );
}
