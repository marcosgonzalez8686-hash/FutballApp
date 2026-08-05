import { prisma } from "@/lib/prisma";
import { ExerciseForm } from "../ExerciseForm";
import { createExercise } from "../actions";

export default async function NuevoEjercicioPage() {
  const materials = await prisma.material.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-gray-500">Nuevo ejercicio</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <ExerciseForm materials={materials} action={createExercise} />
      </div>
    </div>
  );
}
