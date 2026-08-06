import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExerciseForm } from "../ExerciseForm";
import { DeleteButton } from "@/components/DeleteButton";
import { updateExercise, deleteExercise } from "../actions";

export default async function EjercicioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [exercise, materials] = await Promise.all([
    prisma.exercise.findUnique({
      where: { id },
      include: { materials: true },
    }),
    prisma.material.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!exercise) notFound();

  const updateExerciseWithId = updateExercise.bind(null, id);
  const deleteExerciseWithId = deleteExercise.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">{exercise.name}</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <ExerciseForm
          exercise={exercise}
          materials={materials}
          action={updateExerciseWithId}
        />
      </div>
      <div className="flex max-w-lg gap-3">
        <Link
          href="/entrenamientos/ejercicios"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Volver
        </Link>
        <form action={deleteExerciseWithId}>
          <DeleteButton
            label="Eliminar ejercicio"
            confirmMessage={`¿Eliminar el ejercicio "${exercise.name}"? Esta acción no se puede deshacer.`}
          />
        </form>
      </div>
    </div>
  );
}
