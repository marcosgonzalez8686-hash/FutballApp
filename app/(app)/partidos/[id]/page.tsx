import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MatchForm } from "../MatchForm";
import { updateMatch, deleteMatch } from "../actions";

export default async function PartidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [match, rivals] = await Promise.all([
    prisma.match.findUnique({ where: { id }, include: { rival: true } }),
    prisma.rival.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!match) notFound();

  const updateMatchWithId = updateMatch.bind(null, id);
  const deleteMatchWithId = deleteMatch.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        vs {match.rival.name}
      </h1>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <MatchForm match={match} rivals={rivals} action={updateMatchWithId} />
      </div>
      <form action={deleteMatchWithId} className="max-w-lg">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Eliminar partido
        </button>
      </form>
    </div>
  );
}
