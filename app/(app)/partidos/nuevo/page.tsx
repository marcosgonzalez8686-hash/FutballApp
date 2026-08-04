import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MatchForm } from "../MatchForm";
import { createMatch } from "../actions";

export default async function NuevoPartidoPage() {
  const rivals = await prisma.rival.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Nuevo partido</h1>
      {rivals.length === 0 ? (
        <p className="text-sm text-gray-500">
          Todavía no hay rivales.{" "}
          <Link href="/rivales/nuevo" className="text-green-700 hover:underline">
            Crea uno primero
          </Link>
          .
        </p>
      ) : (
        <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
          <MatchForm rivals={rivals} action={createMatch} />
        </div>
      )}
    </div>
  );
}
