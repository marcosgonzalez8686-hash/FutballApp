import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ArbitrosPage() {
  const referees = await prisma.referee.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-500">Árbitros</h2>
        <Link
          href="/base-datos/arbitros/nuevo"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Nuevo árbitro
        </Link>
      </div>

      {referees.length === 0 ? (
        <p className="text-sm text-gray-400">Todavía no hay árbitros.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {referees.map((referee) => (
            <Link
              key={referee.id}
              href={`/base-datos/arbitros/${referee.id}`}
              className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
            >
              <p className="font-medium text-gray-900">{referee.name}</p>
              {referee.notes && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {referee.notes}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
