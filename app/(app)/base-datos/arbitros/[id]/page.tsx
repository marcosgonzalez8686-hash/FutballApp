import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RefereeForm } from "../RefereeForm";
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
      <form action={deleteRefereeWithId} className="max-w-lg">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Eliminar árbitro
        </button>
      </form>
    </div>
  );
}
