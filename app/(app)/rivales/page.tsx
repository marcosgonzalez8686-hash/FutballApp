import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function RivalesPage() {
  const rivals = await prisma.rival.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Rivales</h1>
        <Link
          href="/rivales/nuevo"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Nuevo rival
        </Link>
      </div>

      {rivals.length === 0 ? (
        <p className="text-sm text-gray-400">Todavía no hay rivales.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rivals.map((rival) => (
            <Link
              key={rival.id}
              href={`/rivales/${rival.id}`}
              className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
            >
              <p className="font-medium text-gray-900">{rival.name}</p>
              {rival.notes && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {rival.notes}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
