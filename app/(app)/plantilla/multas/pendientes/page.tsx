import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { AutoSubmitCheckbox } from "@/components/AutoSubmitCheckbox";
import { toggleFinePaid, markAllFinesPaidForPlayer } from "../actions";

const reasonLabels = {
  TARDE: "Llega tarde",
  AUSENCIA_NO_JUSTIFICADA: "Ausencia no justificada",
  OTROS: "Otros",
};

export default async function MultasPendientesPage() {
  const players = await prisma.player.findMany({
    where: { inSquad: true },
    include: {
      fines: {
        where: { paid: false },
        orderBy: { createdAt: "desc" },
        include: {
          training: true,
          match: { include: { rival: true } },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const rows = players.filter((p) => p.fines.length > 0);
  const grandTotal = rows.reduce(
    (sum, p) => sum + p.fines.reduce((s, f) => s + f.amount, 0),
    0
  );

  function contextLabel(fine: (typeof rows)[number]["fines"][number]) {
    if (fine.training) return `Entrenamiento del ${formatDate(fine.training.date)}`;
    if (fine.match) return `Partido vs ${fine.match.rival.name}`;
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Multas pendientes</h1>
        {rows.length > 0 && (
          <p className="text-sm text-gray-500">
            Total pendiente de cobro: {grandTotal.toFixed(2)} €
          </p>
        )}
      </div>

      <Link
        href="/plantilla/multas/pendientes/nueva"
        className="max-w-lg rounded-md bg-green-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-800"
      >
        Nueva multa
      </Link>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-400">No hay multas pendientes de cobro.</p>
      ) : (
        <div className="flex max-w-lg flex-col gap-4">
          {rows.map((player) => {
            const total = player.fines.reduce((sum, f) => sum + f.amount, 0);
            const markAllPaidForPlayer = markAllFinesPaidForPlayer.bind(null, player.id);
            return (
              <div
                key={player.id}
                className="rounded-lg border border-gray-200 bg-white p-6"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{player.name}</p>
                    <p className="text-sm text-gray-500">{total.toFixed(2)} €</p>
                  </div>
                  <form action={markAllPaidForPlayer}>
                    <button
                      type="submit"
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Marcar todas cobradas
                    </button>
                  </form>
                </div>
                <ul className="flex flex-col gap-2">
                  {player.fines.map((fine) => (
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
                          action={toggleFinePaid.bind(null, fine.id)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
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
