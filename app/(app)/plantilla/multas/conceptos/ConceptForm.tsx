import type { FineConcept } from "@/app/generated/prisma/client";

const KNOWN_CATEGORIES = [
  "Puntualidad y Asistencia",
  "Indumentaria y Material",
  "Disciplina en el campo",
  "Convivencia y Vestuario",
  "Eventos y Tercer Tiempo",
];

export function ConceptForm({
  concept,
  action,
}: {
  concept?: FineConcept;
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
          defaultValue={concept?.name}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <input
          id="category"
          name="category"
          type="text"
          list="fine-concept-categories"
          defaultValue={concept?.category ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
        <datalist id="fine-concept-categories">
          {KNOWN_CATEGORIES.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Importe por defecto (€) *
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min={0}
          required
          defaultValue={concept?.amount}
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
