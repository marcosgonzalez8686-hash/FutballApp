import Link from "next/link";
import { formatDateWithWeekday } from "@/lib/format";
import type { Prisma } from "@/app/generated/prisma/client";

type Training = Prisma.TrainingGetPayload<{
  include: {
    _count: { select: { exercises: true } };
    exercises: {
      include: {
        exercise: {
          include: { materials: { include: { material: true } } };
        };
      };
    };
  };
}>;

export function TrainingList({ trainings }: { trainings: Training[] }) {
  return (
    <div className="flex flex-col gap-2">
      {trainings.map((training) => {
        const materialNames = Array.from(
          new Set(
            training.exercises.flatMap(
              (te) => te.exercise?.materials.map((m) => m.material.name) ?? []
            )
          )
        );

        return (
          <Link
            key={training.id}
            href={`/entrenamientos/${training.id}`}
            className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
          >
            <p className="font-medium text-gray-900">
              {formatDateWithWeekday(training.date)}
            </p>
            <p className="text-sm text-gray-500">
              {training._count.exercises}{" "}
              {training._count.exercises === 1 ? "ejercicio" : "ejercicios"}{" "}
              · {training.duration ?? 0} min
            </p>
            {materialNames.length > 0 && (
              <p className="mt-1 text-sm text-gray-400">
                Materiales: {materialNames.join(", ")}
              </p>
            )}
          </Link>
        );
      })}
    </div>
  );
}
