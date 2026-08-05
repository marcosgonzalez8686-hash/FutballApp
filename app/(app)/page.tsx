import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime } from "@/lib/format";

export default async function DashboardPage() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [nextTraining, nextMatch, playerCount, rivalCount] =
    await Promise.all([
      prisma.training.findFirst({
        where: { date: { gte: today } },
        orderBy: { date: "asc" },
        include: { exercises: true },
      }),
      prisma.match.findFirst({
        where: { date: { gte: now }, status: "PROGRAMADO" },
        orderBy: { date: "asc" },
        include: { rival: true },
      }),
      prisma.player.count({ where: { inSquad: true } }),
      prisma.rival.count(),
    ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Inicio</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-medium text-gray-500">
            Próximo entrenamiento
          </h2>
          {nextTraining ? (
            <div className="mt-2">
              <p className="text-gray-900">
                {formatDate(nextTraining.date)}
              </p>
              {nextTraining.exercises.length > 0 && (
                <p className="text-sm text-gray-500">
                  {nextTraining.exercises.map((e) => e.name).join(", ")}
                </p>
              )}
              <Link
                href={`/entrenamientos/${nextTraining.id}`}
                className="mt-2 inline-block text-sm text-green-700 hover:underline"
              >
                Ver detalle →
              </Link>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-400">
              No hay entrenamientos programados
            </p>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-medium text-gray-500">
            Próximo partido
          </h2>
          {nextMatch ? (
            <div className="mt-2">
              <p className="text-gray-900">
                vs {nextMatch.rival.name} ({nextMatch.isHome ? "local" : "visitante"})
              </p>
              <p className="text-sm text-gray-500">
                {formatDateTime(nextMatch.date)}
              </p>
              <Link
                href={`/partidos/${nextMatch.id}`}
                className="mt-2 inline-block text-sm text-green-700 hover:underline"
              >
                Ver detalle →
              </Link>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-400">
              No hay partidos programados
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/plantilla"
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
        >
          <p className="text-2xl font-semibold text-gray-900">
            {playerCount}
          </p>
          <p className="text-sm text-gray-500">Jugadores en plantilla</p>
        </Link>
        <Link
          href="/base-datos/clubes"
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
        >
          <p className="text-2xl font-semibold text-gray-900">{rivalCount}</p>
          <p className="text-sm text-gray-500">Clubes registrados</p>
        </Link>
      </div>
    </div>
  );
}
