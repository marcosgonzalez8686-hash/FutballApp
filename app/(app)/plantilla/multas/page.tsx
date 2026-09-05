import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function GestionMultasPage() {
  const players = await prisma.player.findMany({
    where: { inSquad: true },
    include: { fines: { where: { paid: false } } },
    orderBy: { name: "asc" },
  });

  const rows = players
    .filter((p) => p.fines.length > 0)
    .map((p) => ({
      name: p.name,
      total: p.fines.reduce((sum, f) => sum + f.amount, 0),
    }));

  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);

  let whatsappUrl: string | null = null;
  if (rows.length > 0) {
    const lines = [
      "MULTAS PENDIENTES",
      "",
      ...rows.map((r) => `${r.name}: ${r.total.toFixed(2)} €`),
      "",
      `Total: ${grandTotal.toFixed(2)} €`,
    ];
    whatsappUrl = `https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Gestión de multas</h1>

      <Link
        href="/plantilla/multas/pendientes/nueva"
        className="max-w-lg rounded-md bg-green-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-800"
      >
        Nueva multa
      </Link>

      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-lg items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Enviar multas por WhatsApp
        </a>
      )}

      <div className="flex max-w-lg flex-col gap-3">
        <Link
          href="/plantilla/multas/pendientes"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Pendientes</p>
          <p className="text-sm text-gray-500">
            Multas pendientes de cobro, agrupadas por jugador
          </p>
        </Link>

        <Link
          href="/plantilla/multas/cobradas"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Cobradas</p>
          <p className="text-sm text-gray-500">
            Importe cobrado por jugador
          </p>
        </Link>

        <Link
          href="/plantilla/multas/conceptos"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Conceptos de multa</p>
          <p className="text-sm text-gray-500">
            Catálogo de motivos e importes por defecto
          </p>
        </Link>
      </div>

      <Link
        href="/plantilla"
        className="max-w-lg rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Volver
      </Link>
    </div>
  );
}
