import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CoachForm } from "../CoachForm";
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
      <form action={deleteCoachWithId} className="max-w-lg">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Eliminar entrenador
        </button>
      </form>
    </div>
  );
}
