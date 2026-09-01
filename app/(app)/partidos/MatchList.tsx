import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import type { Prisma } from "@/app/generated/prisma/client";

const statusLabels = {
  PROGRAMADO: "Programado",
  JUGADO: "Jugado",
  CANCELADO: "Cancelado",
};

type Match = Prisma.MatchGetPayload<{ include: { rival: true } }>;

export function MatchList({ matches }: { matches: Match[] }) {
  return (
    <div className="flex flex-col gap-2">
      {matches.map((match) => (
        <Link
          key={match.id}
          href={`/partidos/${match.id}`}
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900">
              {match.isHome ? "vs" : "@"} {match.rival.name}
            </p>
            <span className="text-xs text-gray-500">
              {statusLabels[match.status]}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {formatDateTime(match.date)}
            {match.status === "JUGADO" &&
              match.ourScore !== null &&
              match.rivalScore !== null &&
              ` · ${match.ourScore} - ${match.rivalScore}`}
          </p>
        </Link>
      ))}
    </div>
  );
}
