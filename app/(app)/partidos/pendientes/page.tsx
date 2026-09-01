import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MatchList } from "../MatchList";

export default async function PartidosPendientesPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const matches = await prisma.match.findMany({
    where: { date: { gte: startOfToday } },
    orderBy: { date: "asc" },
    include: { rival: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-500">Pendientes</h2>
        <Link
          href="/partidos/nuevo"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Nuevo partido
        </Link>
      </div>

      {matches.length === 0 ? (
        <p className="text-sm text-gray-400">No hay partidos pendientes.</p>
      ) : (
        <MatchList matches={matches} />
      )}
    </div>
  );
}
