import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RefereeForm } from "../RefereeForm";
import { DeleteButton } from "@/components/DeleteButton";
import { updateReferee, deleteReferee } from "../actions";

export default async function ArbitroDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const referee = await prisma.referee.findUnique({ where: { id } });

  if (!referee) notFound();

  const updateRefereeWithId = updateReferee.bind(null, id);
  const deleteRefereeWithId = deleteReferee.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">{referee.name}</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <RefereeForm referee={referee} action={updateRefereeWithId} />
      </div>
      <div className="flex max-w-lg gap-3">
        <Link
          href="/base-datos/arbitros"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Volver
        </Link>
        <form action={deleteRefereeWithId}>
          <DeleteButton
            label="Eliminar árbitro"
            confirmMessage={`¿Eliminar a ${referee.name}? Esta acción no se puede deshacer.`}
          />
        </form>
      </div>
    </div>
  );
}
