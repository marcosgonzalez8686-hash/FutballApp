import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function OjeoMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rival = await prisma.rival.findUnique({ where: { id } });

  if (!rival) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">Ojeo — {rival.name}</h2>

      <div className="flex max-w-lg flex-col gap-3">
        <Link
          href={`/base-datos/clubes/${id}/ojeo/nuevo`}
          className="rounded-lg border border-gray-200 bg-white p-6 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Añadir ojeo</p>
          <p className="text-sm text-gray-500">
            Registrar una observación de partido o vídeo
          </p>
        </Link>

        <Link
          href={`/base-datos/clubes/${id}/ojeo/lista`}
          className="rounded-lg border border-gray-200 bg-white p-6 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Ver ojeos</p>
          <p className="text-sm text-gray-500">Consultar los ojeos registrados</p>
        </Link>
      </div>

      <Link
        href={`/base-datos/clubes/${id}`}
        className="max-w-lg rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Volver
      </Link>
    </div>
  );
}
