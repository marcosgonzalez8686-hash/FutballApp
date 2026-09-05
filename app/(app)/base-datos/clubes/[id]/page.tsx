import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClubForm } from "../ClubForm";
import { DeleteButton } from "@/components/DeleteButton";
import { updateRival, deleteRival } from "../actions";

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rival = await prisma.rival.findUnique({ where: { id } });

  if (!rival) notFound();

  const updateRivalWithId = updateRival.bind(null, id);
  const deleteRivalWithId = deleteRival.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">{rival.name}</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <ClubForm rival={rival} action={updateRivalWithId} />
      </div>

      <Link
        href={`/base-datos/clubes/${id}/ojeo`}
        className="max-w-lg rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
      >
        <p className="font-medium text-gray-900">Ojeo</p>
        <p className="text-sm text-gray-500">
          Observaciones de partidos y vídeos de este club
        </p>
      </Link>

      <div className="flex max-w-lg gap-3">
        <Link
          href="/base-datos/clubes"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Volver
        </Link>
        <form action={deleteRivalWithId}>
          <DeleteButton
            label="Eliminar club"
            confirmMessage={`¿Eliminar el club ${rival.name}? Esta acción no se puede deshacer.`}
          />
        </form>
      </div>
    </div>
  );
}
