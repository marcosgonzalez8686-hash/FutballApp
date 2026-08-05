import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateWithWeekday } from "@/lib/format";

export default async function EntrenamientosPage() {
  const trainings = await prisma.training.findMany({
    orderBy: { date: "desc" },
    include: { _count: { select: { exercises: true } } },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-500">Sesiones</h2>
        <Link
          href="/entrenamientos/nuevo"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Nuevo entrenamiento
        </Link>
      </div>

      {trainings.length === 0 ? (
        <p className="text-sm text-gray-400">
          Todavía no hay entrenamientos.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {trainings.map((training) => (
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
