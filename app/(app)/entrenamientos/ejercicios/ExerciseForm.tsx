import type { Material } from "@/app/generated/prisma/client";

type ExerciseWithMaterials = {
  id: string;
  name: string;
  duration: number | null;
  explanation: string | null;
  materials: { materialId: string }[];
};

export function ExerciseForm({
  exercise,
  materials,
  action,
}: {
  exercise?: ExerciseWithMaterials;
  materials: Material[];
  action: (formData: FormData) => void;
}) {
  const selectedMaterialIds = new Set(
    exercise?.materials.map((m) => m.materialId) ?? []
  );

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
          defaultValue={exercise?.name}
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
          defaultValue={exercise?.duration ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">
          Explicación
        </label>
        <textarea
          id="explanation"
          name="explanation"
          rows={4}
          defaultValue={exercise?.explanation ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700">Materiales</span>
        {materials.length === 0 ? (
          <p className="mt-1 text-sm text-gray-400">
            Todavía no hay materiales dados de alta.
          </p>
        ) : (
          <div className="mt-1 flex flex-col gap-1.5">
            {materials.map((material) => (
              <label key={material.id} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="materialIds"
                  value={material.id}
                  defaultChecked={selectedMaterialIds.has(material.id)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                {material.name}
              </label>
            ))}
          </div>
        )}
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
