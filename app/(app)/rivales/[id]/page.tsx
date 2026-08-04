import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RivalForm } from "../RivalForm";
import { updateRival, deleteRival } from "../actions";

export default async function RivalDetailPage({
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
      <h1 className="text-2xl font-semibold text-gray-900">{rival.name}</h1>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <RivalForm rival={rival} action={updateRivalWithId} />
      </div>
      <form action={deleteRivalWithId} className="max-w-lg">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Eliminar rival
        </button>
      </form>
    </div>
  );
}
