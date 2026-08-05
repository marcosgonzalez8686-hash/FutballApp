import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function EntrenadoresPage() {
  const coaches = await prisma.coach.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-500">Entrenadores</h2>
        <Link
          href="/base-datos/entrenadores/nuevo"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Nuevo entrenador
        </Link>
      </div>

      {coaches.length === 0 ? (
        <p className="text-sm text-gray-400">Todavía no hay entrenadores.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {coaches.map((coach) => (
            <Link
              key={coach.id}
              href={`/base-datos/entrenadores/${coach.id}`}
              className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
            >
              <p className="font-medium text-gray-900">{coach.name}</p>
              {coach.club && (
                <p className="text-sm text-gray-500">{coach.club}</p>
              )}
              {coach.formation && (
                <p className="text-sm text-gray-400">{coach.formation}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
