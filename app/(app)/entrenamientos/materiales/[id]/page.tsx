import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MaterialForm } from "../MaterialForm";
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
      <form action={deleteMaterialWithId} className="max-w-lg">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Eliminar material
        </button>
      </form>
    </div>
  );
}
