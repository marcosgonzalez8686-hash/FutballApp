import { toDateTimeLocalValue } from "@/lib/format";
import type { Training } from "@/app/generated/prisma/client";

export function TrainingForm({
  training,
  action,
}: {
  training?: Training;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Fecha y hora *
        </label>
        <input
          id="date"
          name="date"
          type="datetime-local"
          required
          defaultValue={training?.date ? toDateTimeLocalValue(training.date) : ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duración (minutos)
        </label>
        <input
          id="duration"
          name="duration"
          type="number"
          min={0}
          defaultValue={training?.duration ?? ""}
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
          rows={4}
          defaultValue={training?.notes ?? ""}
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
