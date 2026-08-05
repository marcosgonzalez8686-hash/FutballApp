import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDateWithWeekday } from "@/lib/format";
import { deleteTraining } from "../actions";

export default async function EntrenamientoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const training = await prisma.training.findUnique({ where: { id } });

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
      </div>

      <form action={deleteTrainingWithId} className="max-w-lg">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Eliminar entrenamiento
        </button>
      </form>
    </div>
  );
}
