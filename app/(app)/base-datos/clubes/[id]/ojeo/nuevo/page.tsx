import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createScouting } from "../actions";
import { ScoutingForm } from "../ScoutingForm";

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
        <ScoutingForm action={createScoutingWithId} />
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
