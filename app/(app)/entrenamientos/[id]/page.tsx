import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TrainingForm } from "../TrainingForm";
import { updateTraining, deleteTraining, saveAttendance } from "../actions";

export default async function EntrenamientoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [training, players] = await Promise.all([
    prisma.training.findUnique({
      where: { id },
      include: { attendances: true },
    }),
    prisma.player.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!training) notFound();

  const attendanceByPlayer = new Map(
    training.attendances.map((a) => [a.playerId, a.status])
  );

  const updateTrainingWithId = updateTraining.bind(null, id);
  const deleteTrainingWithId = deleteTraining.bind(null, id);
  const saveAttendanceWithId = saveAttendance.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Entrenamiento</h1>

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
          Asistencia
        </h2>
        {players.length === 0 ? (
          <p className="text-sm text-gray-400">No hay jugadores.</p>
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
