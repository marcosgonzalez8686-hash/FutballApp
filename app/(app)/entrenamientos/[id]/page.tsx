import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TrainingForm } from "../TrainingForm";
import {
  updateTraining,
  deleteTraining,
  saveAttendance,
  addCatalogExercise,
  addManualExercise,
  removeTrainingExercise,
} from "../actions";

export default async function EntrenamientoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [training, players, exerciseCatalog] = await Promise.all([
    prisma.training.findUnique({
      where: { id },
      include: { attendances: true, exercises: true },
    }),
    prisma.player.findMany({
      where: { inSquad: true },
      orderBy: { name: "asc" },
    }),
    prisma.exercise.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!training) notFound();

  const attendanceByPlayer = new Map(
    training.attendances.map((a) => [a.playerId, a.status])
  );

  const updateTrainingWithId = updateTraining.bind(null, id);
  const deleteTrainingWithId = deleteTraining.bind(null, id);
  const saveAttendanceWithId = saveAttendance.bind(null, id);
  const addCatalogExerciseWithId = addCatalogExercise.bind(null, id);
  const addManualExerciseWithId = addManualExercise.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">Sesión</h2>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <TrainingForm training={training} action={updateTrainingWithId} />
      </div>

      <form action={deleteTrainingWithId} className="max-w-lg">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Eliminar entrenamiento
        </button>
      </form>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Ejercicios de la sesión
        </h2>

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
                  <span className="text-sm text-gray-900">{te.name}</span>
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
            <button
              type="submit"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Añadir
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Asistencia
        </h2>
        {players.length === 0 ? (
          <p className="text-sm text-gray-400">No hay jugadores en la plantilla.</p>
        ) : (
          <form action={saveAttendanceWithId} className="flex flex-col gap-3">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between gap-4"
              >
                <span className="text-sm text-gray-900">{player.name}</span>
                <select
                  name={`status-${player.id}`}
                  defaultValue={attendanceByPlayer.get(player.id) ?? "PENDIENTE"}
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-green-600 focus:outline-none"
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="CONFIRMADO">Confirmado</option>
                  <option value="AUSENTE">Ausente</option>
                </select>
              </div>
            ))}
            <button
              type="submit"
              className="mt-2 rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
            >
              Guardar asistencia
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
