import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toDateInputValue } from "@/lib/format";
import { createScouting } from "../actions";

export default async function NuevoOjeoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rival = await prisma.rival.findUnique({ where: { id } });

  if (!rival) notFound();

  const createScoutingWithId = createScouting.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">Añadir ojeo — {rival.name}</h2>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <form action={createScoutingWithId} className="flex flex-col gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Fecha *
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={toDateInputValue(new Date())}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="scoutName" className="block text-sm font-medium text-gray-700">
              Ojeador
            </label>
            <input
              id="scoutName"
              name="scoutName"
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notas
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={5}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
          >
            Guardar
          </button>
        </form>
      </div>

      <Link
        href={`/base-datos/clubes/${id}/ojeo`}
        className="max-w-lg rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Volver
      </Link>
    </div>
  );
}
