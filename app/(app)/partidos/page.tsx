import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";

const statusLabels = {
  PROGRAMADO: "Programado",
  JUGADO: "Jugado",
  CANCELADO: "Cancelado",
};

export default async function PartidosPage() {
  const matches = await prisma.match.findMany({
    orderBy: { date: "desc" },
    include: { rival: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Partidos</h1>
        <Link
          href="/partidos/nuevo"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Nuevo partido
        </Link>
      </div>

      {matches.length === 0 ? (
        <p className="text-sm text-gray-400">Todavía no hay partidos.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {matches.map((match) => (
            <Link
              key={match.id}
              href={`/partidos/${match.id}`}
              className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">
                  {match.isHome ? "vs" : "@"} {match.rival.name}
                </p>
                <span className="text-xs text-gray-500">
                  {statusLabels[match.status]}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {formatDateTime(match.date)}
                {match.status === "JUGADO" &&
                  match.ourScore !== null &&
                  match.rivalScore !== null &&
                  ` · ${match.ourScore} - ${match.rivalScore}`}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
