import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExerciseForm } from "../ExerciseForm";
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
      <form action={deleteExerciseWithId} className="max-w-lg">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Eliminar ejercicio
        </button>
      </form>
    </div>
  );
}
