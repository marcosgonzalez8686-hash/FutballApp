import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { deleteScouting } from "../actions";

export default async function ListaOjeosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [rival, scoutings] = await Promise.all([
    prisma.rival.findUnique({ where: { id } }),
    prisma.scouting.findMany({
      where: { rivalId: id },
      orderBy: { date: "desc" },
    }),
  ]);

  if (!rival) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">Ojeos — {rival.name}</h2>

      {scoutings.length === 0 ? (
        <p className="text-sm text-gray-400">Todavía no hay ojeos registrados.</p>
      ) : (
        <div className="flex max-w-lg flex-col gap-2">
          {scoutings.map((scouting) => {
            const deleteWithIds = deleteScouting.bind(null, scouting.id, id);
            return (
              <div
                key={scouting.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">
                    {formatDate(scouting.date)}
                    {scouting.scoutName && ` · ${scouting.scoutName}`}
                  </p>
                  <form action={deleteWithIds}>
                    <button
                      type="submit"
                      className="text-xs text-gray-400 hover:underline"
                    >
                      Quitar
                    </button>
                  </form>
                </div>
                {scouting.bpOfensivo && (
                  <p className="mt-2 whitespace-pre-line text-sm text-gray-500">
                    <span className="font-medium text-gray-700">BP Ofensivo: </span>
                    {scouting.bpOfensivo}
                  </p>
                )}
                {scouting.bpDefensivo && (
                  <p className="mt-1 whitespace-pre-line text-sm text-gray-500">
                    <span className="font-medium text-gray-700">BP Defensivo: </span>
                    {scouting.bpDefensivo}
                  </p>
                )}
                {scouting.salidaBalon && (
                  <p className="mt-1 whitespace-pre-line text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Salida de balón: </span>
                    {scouting.salidaBalon}
                  </p>
                )}
                {scouting.notes && (
                  <p className="mt-1 whitespace-pre-line text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Notas: </span>
                    {scouting.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex max-w-lg gap-3">
        <Link
          href={`/base-datos/clubes/${id}/ojeo`}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Volver
        </Link>
        <Link
          href={`/base-datos/clubes/${id}/ojeo/nuevo`}
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Añadir ojeo
        </Link>
      </div>
    </div>
  );
}
