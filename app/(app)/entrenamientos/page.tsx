import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";

export default async function EntrenamientosPage() {
  const trainings = await prisma.training.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Entrenamientos</h1>
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
                {formatDateTime(training.date)}
              </p>
              {training.exercise && (
                <p className="text-sm text-gray-500">{training.exercise}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
