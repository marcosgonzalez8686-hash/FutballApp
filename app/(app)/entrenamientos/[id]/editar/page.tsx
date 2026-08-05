import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TrainingForm } from "../../TrainingForm";
import { updateTraining } from "../../actions";

export default async function EditarEntrenamientoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const training = await prisma.training.findUnique({ where: { id } });

  if (!training) notFound();

  const updateTrainingWithId = updateTraining.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">Editar sesión</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <TrainingForm training={training} action={updateTrainingWithId} />
      </div>
    </div>
  );
}
