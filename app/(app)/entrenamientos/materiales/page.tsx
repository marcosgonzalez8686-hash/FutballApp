import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function MaterialesPage() {
  const materials = await prisma.material.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-500">Materiales</h2>
        <Link
          href="/entrenamientos/materiales/nuevo"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Nuevo material
        </Link>
      </div>

      {materials.length === 0 ? (
        <p className="text-sm text-gray-400">Todavía no hay materiales.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-2 font-medium">Nombre</th>
                <th className="px-4 py-2 font-medium">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2">
                    <Link
                      href={`/entrenamientos/materiales/${material.id}`}
                      className="font-medium text-gray-900 hover:text-green-700"
                    >
                      {material.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {material.quantity ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
