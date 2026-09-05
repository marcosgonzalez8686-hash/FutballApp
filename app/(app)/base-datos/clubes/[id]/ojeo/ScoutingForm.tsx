import { toDateInputValue } from "@/lib/format";
import type { Scouting } from "@/app/generated/prisma/client";

export function ScoutingForm({
  scouting,
  action,
}: {
  scouting?: Scouting;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Fecha *
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={toDateInputValue(scouting?.date ?? new Date())}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="scoutName" className="block text-sm font-medium text-gray-700">
          Ojeador
        </label>
        <input
          id="scoutName"
          name="scoutName"
          type="text"
          defaultValue={scouting?.scoutName ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="opponent" className="block text-sm font-medium text-gray-700">
          Rival del partido ojeado
        </label>
        <input
          id="opponent"
          name="opponent"
          type="text"
          defaultValue={scouting?.opponent ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="bpOfensivo" className="block text-sm font-medium text-gray-700">
          BP Ofensivo
        </label>
        <textarea
          id="bpOfensivo"
          name="bpOfensivo"
          rows={3}
          defaultValue={scouting?.bpOfensivo ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="bpDefensivo" className="block text-sm font-medium text-gray-700">
          BP Defensivo
        </label>
        <textarea
          id="bpDefensivo"
          name="bpDefensivo"
          rows={3}
          defaultValue={scouting?.bpDefensivo ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="salidaBalon" className="block text-sm font-medium text-gray-700">
          Salida de balón
        </label>
        <textarea
          id="salidaBalon"
          name="salidaBalon"
          rows={3}
          defaultValue={scouting?.salidaBalon ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notas
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          defaultValue={scouting?.notes ?? ""}
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
