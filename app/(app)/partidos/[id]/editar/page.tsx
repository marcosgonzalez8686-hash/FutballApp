import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MatchForm } from "../../MatchForm";
import { updateMatch } from "../../actions";

export default async function EditarPartidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [match, rivals] = await Promise.all([
    prisma.match.findUnique({ where: { id } }),
    prisma.rival.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!match) notFound();

  const updateMatchWithId = updateMatch.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-medium text-gray-500">Editar partido</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <MatchForm match={match} rivals={rivals} action={updateMatchWithId} />
      </div>
    </div>
  );
}
