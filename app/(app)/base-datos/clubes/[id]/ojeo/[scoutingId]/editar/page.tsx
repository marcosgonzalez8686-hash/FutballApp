import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateScouting } from "../../actions";
import { ScoutingForm } from "../../ScoutingForm";

export default async function EditarOjeoPage({
  params,
}: {
  params: Promise<{ id: string; scoutingId: string }>;
}) {
  const { id, scoutingId } = await params;

  const [rival, scouting] = await Promise.all([
    prisma.rival.findUnique({ where: { id } }),
    prisma.scouting.findUnique({ where: { id: scoutingId } }),
  ]);

  if (!rival || !scouting || scouting.rivalId !== id) notFound();

  const updateScoutingWithIds = updateScouting.bind(null, scoutingId, id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">Editar ojeo — {rival.name}</h2>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <ScoutingForm scouting={scouting} action={updateScoutingWithIds} />
      </div>

      <Link
        href={`/base-datos/clubes/${id}/ojeo/lista`}
        className="max-w-lg rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Volver
      </Link>
    </div>
  );
}
