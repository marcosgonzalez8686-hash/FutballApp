import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  addCatalogExercise,
  addManualExercise,
  removeTrainingExercise,
} from "../../actions";

export default async function EjerciciosSesionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [training, exerciseCatalog] = await Promise.all([
    prisma.training.findUnique({
      where: { id },
      include: { exercises: true },
    }),
    prisma.exercise.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!training) notFound();

  const addCatalogExerciseWithId = addCatalogExercise.bind(null, id);
  const addManualExerciseWithId = addManualExercise.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          Ejercicios de la sesión
        </h2>
        <p className="text-sm text-gray-400">
          Duración total: {training.duration ?? 0} min
        </p>
      </div>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        {training.exercises.length === 0 ? (
          <p className="mb-4 text-sm text-gray-400">
            Todavía no hay ejercicios añadidos.
          </p>
        ) : (
          <ul className="mb-4 flex flex-col gap-2">
            {training.exercises.map((te) => {
              const removeWithIds = removeTrainingExercise.bind(
                null,
                te.id,
                id
              );
              return (
                <li
                  key={te.id}
                  className="flex items-center justify-between gap-4 rounded-md border border-gray-100 px-3 py-2"
                >
                  <span className="text-sm text-gray-900">
                    {te.name}
                    {te.duration ? ` (${te.duration} min)` : ""}
                  </span>
                  <form action={removeWithIds}>
                    <button
                      type="submit"
                      className="text-xs text-gray-400 hover:underline"
                    >
                      Quitar
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
          {exerciseCatalog.length > 0 && (
            <form action={addCatalogExerciseWithId} className="flex gap-2">
              <select
                name="exerciseId"
                required
                defaultValue=""
                className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-green-600 focus:outline-none"
              >
                <option value="" disabled>
                  Elegir del catálogo
                </option>
                {exerciseCatalog.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                    {ex.duration ? ` (${ex.duration} min)` : ""}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-md bg-green-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-800"
              >
                Añadir
              </button>
            </form>
          )}

          <form action={addManualExerciseWithId} className="flex gap-2">
            <input
              type="text"
              name="manualName"
              required
              placeholder="Añadir ejercicio manual"
              className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-green-600 focus:outline-none"
            />
            <input
              type="number"
              name="manualDuration"
              min={0}
              placeholder="min"
              className="w-16 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-green-600 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Añadir
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
