import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MaterialForm } from "../MaterialForm";
import { DeleteButton } from "@/components/DeleteButton";
import { updateMaterial, deleteMaterial } from "../actions";

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const material = await prisma.material.findUnique({ where: { id } });

  if (!material) notFound();

  const updateMaterialWithId = updateMaterial.bind(null, id);
  const deleteMaterialWithId = deleteMaterial.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">{material.name}</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <MaterialForm material={material} action={updateMaterialWithId} />
      </div>
      <div className="flex max-w-lg gap-3">
        <Link
          href="/entrenamientos/materiales"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Volver
        </Link>
        <form action={deleteMaterialWithId}>
          <DeleteButton
            label="Eliminar material"
            confirmMessage={`¿Eliminar el material "${material.name}"? Esta acción no se puede deshacer.`}
          />
        </form>
      </div>
    </div>
  );
}
