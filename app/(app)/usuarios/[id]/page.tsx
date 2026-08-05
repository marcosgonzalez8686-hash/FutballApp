import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EditUserForm } from "../EditUserForm";
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
      {!isSelf && (
        <form action={deleteUserWithId} className="max-w-lg">
          <button type="submit" className="text-sm text-red-600 hover:underline">
            Eliminar usuario
          </button>
        </form>
      )}
    </div>
  );
}
