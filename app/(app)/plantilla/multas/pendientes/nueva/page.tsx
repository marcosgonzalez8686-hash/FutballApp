import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FineForm } from "@/components/FineForm";
import { createStandaloneFine } from "../../actions";

export default async function NuevaMultaPage() {
  const players = await prisma.player.findMany({
    where: { inSquad: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Nueva multa</h1>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <FineForm players={players} action={createStandaloneFine} />
      </div>

      <Link
        href="/plantilla/multas/pendientes"
        className="max-w-lg rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Volver
      </Link>
    </div>
  );
}
