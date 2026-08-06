import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EditUserForm } from "../EditUserForm";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteUser } from "../actions";

export default async function UsuarioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [session, user] = await Promise.all([
    auth(),
    prisma.user.findUnique({ where: { id } }),
  ]);

  if (!user) notFound();

  const isSelf = session?.user?.id === user.id;
  const deleteUserWithId = deleteUser.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <EditUserForm user={user} />
      </div>
      <div className="flex max-w-lg gap-3">
        <Link
          href="/usuarios"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Volver
        </Link>
        {!isSelf && (
          <form action={deleteUserWithId}>
            <DeleteButton
              label="Eliminar usuario"
              confirmMessage={`¿Eliminar la cuenta de ${user.name}? Esta acción no se puede deshacer.`}
            />
          </form>
        )}
      </div>
    </div>
  );
}
