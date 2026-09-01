import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateWithWeekday } from "@/lib/format";

export default async function EntrenamientosPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const trainingInclude = {
    _count: { select: { exercises: true } },
    exercises: {
      include: {
        exercise: {
          include: { materials: { include: { material: true } } },
        },
      },
    },
  } as const;

  const [pending, finished] = await Promise.all([
    prisma.training.findMany({
      where: { date: { gte: startOfToday } },
      orderBy: { date: "asc" },
      include: trainingInclude,
    }),
    prisma.training.findMany({
      where: { date: { lt: startOfToday } },
      orderBy: { date: "desc" },
      include: trainingInclude,
    }),
  ]);

  function TrainingList({ trainings }: { trainings: typeof pending }) {
    return (
      <div className="flex flex-col gap-2">
        {trainings.map((training) => {
          const materialNames = Array.from(
            new Set(
              training.exercises.flatMap(
                (te) => te.exercise?.materials.map((m) => m.material.name) ?? []
              )
            )
          );

          return (
            <Link
              key={training.id}
              href={`/entrenamientos/${training.id}`}
              className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
            >
              <p className="font-medium text-gray-900">
                {formatDateWithWeekday(training.date)}
              </p>
              <p className="text-sm text-gray-500">
                {training._count.exercises}{" "}
                {training._count.exercises === 1 ? "ejercicio" : "ejercicios"}{" "}
                · {training.duration ?? 0} min
              </p>
              {materialNames.length > 0 && (
                <p className="mt-1 text-sm text-gray-400">
                  Materiales: {materialNames.join(", ")}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-500">Sesiones</h2>
        <Link
          href="/entrenamientos/nuevo"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Nuevo entrenamiento
        </Link>
      </div>

      {pending.length === 0 && finished.length === 0 ? (
        <p className="text-sm text-gray-400">
          Todavía no hay entrenamientos.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-gray-500">Pendientes</h3>
            {pending.length === 0 ? (
              <p className="text-sm text-gray-400">No hay entrenamientos pendientes.</p>
            ) : (
              <TrainingList trainings={pending} />
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-gray-500">Finalizados</h3>
            {finished.length === 0 ? (
              <p className="text-sm text-gray-400">Todavía no hay entrenamientos finalizados.</p>
            ) : (
              <TrainingList trainings={finished} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
