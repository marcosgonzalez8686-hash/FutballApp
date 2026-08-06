import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CoachForm } from "../CoachForm";
import { DeleteButton } from "@/components/DeleteButton";
import { updateCoach, deleteCoach } from "../actions";

export default async function EntrenadorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coach = await prisma.coach.findUnique({ where: { id } });

  if (!coach) notFound();

  const updateCoachWithId = updateCoach.bind(null, id);
  const deleteCoachWithId = deleteCoach.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">{coach.name}</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <CoachForm coach={coach} action={updateCoachWithId} />
      </div>
      <div className="flex max-w-lg gap-3">
        <Link
          href="/base-datos/entrenadores"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Volver
        </Link>
        <form action={deleteCoachWithId}>
          <DeleteButton
            label="Eliminar entrenador"
            confirmMessage={`¿Eliminar a ${coach.name}? Esta acción no se puede deshacer.`}
          />
        </form>
      </div>
    </div>
  );
}
