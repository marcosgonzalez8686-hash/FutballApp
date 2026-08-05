import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toggleMaterialCollected } from "../../actions";
import { MaterialCheckToggle } from "./MaterialCheckToggle";

export default async function ListaMaterialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const training = await prisma.training.findUnique({
    where: { id },
    include: {
      exercises: {
        include: {
          exercise: {
            include: { materials: { include: { material: true } } },
          },
        },
      },
      materialChecks: true,
    },
  });

  if (!training) notFound();

  const materialsById = new Map<string, { id: string; name: string }>();
  for (const te of training.exercises) {
    for (const em of te.exercise?.materials ?? []) {
      materialsById.set(em.material.id, em.material);
    }
  }
  const materials = Array.from(materialsById.values());

  const collectedByMaterial = new Map(
    training.materialChecks.map((c) => [c.materialId, c.collected])
  );
  const collectedCount = materials.filter((m) =>
    collectedByMaterial.get(m.id)
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          Lista de material
        </h2>
        {materials.length > 0 && (
          <p className="text-sm text-gray-400">
            {collectedCount} de {materials.length} cogidos
          </p>
        )}
      </div>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        {materials.length === 0 ? (
          <p className="text-sm text-gray-400">
            Los ejercicios de esta sesión no tienen materiales asociados.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {materials.map((material) => {
              const toggleWithIds = toggleMaterialCollected.bind(
                null,
                id,
                material.id
              );
              return (
                <li
                  key={material.id}
                  className="flex items-center justify-between gap-4 rounded-md border border-gray-100 px-3 py-2"
                >
                  <span className="text-sm text-gray-900">{material.name}</span>
                  <MaterialCheckToggle
                    defaultChecked={collectedByMaterial.get(material.id) ?? false}
                    action={toggleWithIds}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
