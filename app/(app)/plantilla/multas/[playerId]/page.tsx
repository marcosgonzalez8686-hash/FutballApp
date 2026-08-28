import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { AutoSubmitCheckbox } from "@/components/AutoSubmitCheckbox";
import { toggleFinePaid } from "../actions";

const reasonLabels = {
  TARDE: "Llega tarde",
  AUSENCIA_NO_JUSTIFICADA: "Ausencia no justificada",
  OTROS: "Otros",
};

export default async function MultasJugadorPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;

  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: {
      fines: {
        orderBy: { createdAt: "desc" },
        include: {
          training: true,
          match: { include: { rival: true } },
        },
      },
    },
  });

  if (!player) notFound();

  const fines = player.fines;

  function contextLabel(fine: (typeof fines)[number]) {
    if (fine.training) return `Entrenamiento del ${formatDate(fine.training.date)}`;
    if (fine.match) return `Partido vs ${fine.match.rival.name}`;
    return null;
  }

  const pending = fines.filter((f) => !f.paid);
  const paid = fines.filter((f) => f.paid);
  const pendingTotal = pending.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">{player.name} — Multas</h2>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-3 text-sm font-medium text-gray-500">
          Pendientes {pending.length > 0 && `(${pendingTotal.toFixed(2)} €)`}
        </h3>
        {pending.length === 0 ? (
          <p className="text-sm text-gray-400">No tiene multas pendientes.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {pending.map((fine) => (
              <li
                key={fine.id}
                className="flex items-center justify-between gap-4 rounded-md border border-gray-100 px-3 py-2"
              >
                <div>
                  <p className="text-sm text-gray-900">
                    {fine.amount.toFixed(2)} € · {reasonLabels[fine.reason]}
                  </p>
                  <p className="text-xs text-gray-400">
                    {contextLabel(fine)}
                    {fine.comment && ` — ${fine.comment}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  Cobrada
                  <AutoSubmitCheckbox
                    name="paid"
                    defaultChecked={false}
                    action={toggleFinePaid.bind(null, fine.id, playerId)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="max-w-lg rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h3 className="mb-3 text-sm font-medium text-gray-500">Pagadas</h3>
        {paid.length === 0 ? (
          <p className="text-sm text-gray-400">Todavía no hay multas pagadas.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {paid.map((fine) => (
              <li
                key={fine.id}
                className="flex items-center justify-between gap-4 rounded-md border border-gray-100 bg-white px-3 py-2"
              >
                <div>
                  <p className="text-sm text-gray-900">
                    {fine.amount.toFixed(2)} € · {reasonLabels[fine.reason]}
                  </p>
                  <p className="text-xs text-gray-400">
                    {contextLabel(fine)}
                    {fine.comment && ` — ${fine.comment}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  Cobrada
                  <AutoSubmitCheckbox
                    name="paid"
                    defaultChecked={true}
                    action={toggleFinePaid.bind(null, fine.id, playerId)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        href="/plantilla/multas"
        className="max-w-lg rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Volver
      </Link>
    </div>
  );
}
