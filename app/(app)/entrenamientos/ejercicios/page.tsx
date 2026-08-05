import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function EjerciciosPage() {
  const exercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
    include: { materials: { include: { material: true } } },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-500">Ejercicios</h2>
        <Link
          href="/entrenamientos/ejercicios/nuevo"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Nuevo ejercicio
        </Link>
      </div>

      {exercises.length === 0 ? (
        <p className="text-sm text-gray-400">Todavía no hay ejercicios.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {exercises.map((exercise) => (
            <Link
              key={exercise.id}
              href={`/entrenamientos/ejercicios/${exercise.id}`}
              className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
            >
              <p className="font-medium text-gray-900">{exercise.name}</p>
              {exercise.duration && (
                <p className="text-sm text-gray-500">{exercise.duration} min</p>
              )}
              {exercise.materials.length > 0 && (
                <p className="mt-1 text-sm text-gray-400">
                  {exercise.materials.map((m) => m.material.name).join(", ")}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
