import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDateWithWeekday } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteTraining } from "../actions";

export default async function EntrenamientoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [training, fineTotal] = await Promise.all([
    prisma.training.findUnique({ where: { id } }),
    prisma.fine.aggregate({
      where: { trainingId: id },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  if (!training) notFound();

  const deleteTrainingWithId = deleteTraining.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {formatDateWithWeekday(training.date)}
        </h2>
        <p className="text-sm text-gray-500">
          Duración total: {training.duration ?? 0} min
        </p>
        {training.notes && (
          <p className="mt-1 text-sm text-gray-500">{training.notes}</p>
        )}
      </div>

      <div className="grid max-w-lg gap-3 sm:grid-cols-2">
        <Link
          href={`/entrenamientos/${id}/editar`}
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Editar</p>
          <p className="text-sm text-gray-500">Fecha y notas de la sesión</p>
        </Link>
        <Link
          href={`/entrenamientos/${id}/ejercicios`}
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Ejercicios</p>
          <p className="text-sm text-gray-500">Añadir o quitar ejercicios</p>
        </Link>
        <Link
          href={`/entrenamientos/${id}/asistencia`}
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Asistencia</p>
          <p className="text-sm text-gray-500">Confirmar quién viene</p>
        </Link>
        <Link
          href={`/entrenamientos/${id}/material`}
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Lista material</p>
          <p className="text-sm text-gray-500">Marcar lo ya cogido</p>
        </Link>
        <Link
          href={`/entrenamientos/${id}/multas`}
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Multas</p>
          <p className="text-sm text-gray-500">
            {fineTotal._count > 0
              ? `${fineTotal._count} · ${(fineTotal._sum.amount ?? 0).toFixed(2)} €`
              : "Sin multas"}
          </p>
        </Link>
      </div>

      <div className="flex max-w-lg gap-3">
        <Link
          href="/entrenamientos"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Volver
        </Link>
        <form action={deleteTrainingWithId}>
          <DeleteButton
            label="Eliminar entrenamiento"
            confirmMessage="¿Eliminar este entrenamiento? Se borrarán también su asistencia y ejercicios. Esta acción no se puede deshacer."
          />
        </form>
      </div>
    </div>
  );
}
