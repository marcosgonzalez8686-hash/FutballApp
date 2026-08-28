import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function GestionMultasPage() {
  const players = await prisma.player.findMany({
    where: { inSquad: true },
    include: { fines: true },
    orderBy: { name: "asc" },
  });

  const rows = players
    .filter((p) => p.fines.length > 0)
    .map((p) => {
      const pending = p.fines.filter((f) => !f.paid);
      return {
        id: p.id,
        name: p.name,
        pendingCount: pending.length,
        pendingTotal: pending.reduce((sum, f) => sum + f.amount, 0),
      };
    });

  const grandTotal = rows.reduce((sum, r) => sum + r.pendingTotal, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de multas</h1>
        <p className="text-sm text-gray-500">
          Total pendiente de cobro: {grandTotal.toFixed(2)} €
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-400">Todavía no hay multas registradas.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-2 font-medium">Jugador</th>
                <th className="px-4 py-2 font-medium">Multas pendientes</th>
                <th className="px-4 py-2 font-medium">Importe pendiente</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2">
                    <Link
                      href={`/plantilla/multas/${row.id}`}
                      className="font-medium text-gray-900 hover:text-green-700"
                    >
                      {row.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{row.pendingCount}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {row.pendingTotal.toFixed(2)} €
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
