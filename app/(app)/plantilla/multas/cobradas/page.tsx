import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function MultasCobradasPage() {
  const players = await prisma.player.findMany({
    where: { inSquad: true },
    include: { fines: { where: { paid: true } } },
    orderBy: { name: "asc" },
  });

  const rows = players
    .filter((p) => p.fines.length > 0)
    .map((p) => ({
      id: p.id,
      name: p.name,
      count: p.fines.length,
      total: p.fines.reduce((sum, f) => sum + f.amount, 0),
    }));

  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Multas cobradas</h1>
        {rows.length > 0 && (
          <p className="text-sm text-gray-500">Total cobrado: {grandTotal.toFixed(2)} €</p>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-400">Todavía no se ha cobrado ninguna multa.</p>
      ) : (
        <div className="max-w-lg overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-2 font-medium">Jugador</th>
                <th className="px-4 py-2 font-medium">Multas cobradas</th>
                <th className="px-4 py-2 font-medium">Importe cobrado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-2 text-gray-600">{row.count}</td>
                  <td className="px-4 py-2 text-gray-600">{row.total.toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link
        href="/plantilla/multas"
        className="max-w-lg rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Volver
      </Link>
    </div>
  );
}
