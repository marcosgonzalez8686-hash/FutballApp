import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function UsuariosPage() {
  const [session, users] = await Promise.all([
    auth(),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Usuarios</h1>
        <Link
          href="/usuarios/nuevo"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Nuevo usuario
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-2 font-medium">Nombre</th>
              <th className="px-4 py-2 font-medium">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-2">
                  <Link
                    href={`/usuarios/${user.id}`}
                    className="font-medium text-gray-900 hover:text-green-700"
                  >
                    {user.name}
                  </Link>
                  {user.id === session?.user?.id && (
                    <span className="ml-1 text-gray-400">(tú)</span>
                  )}
                </td>
                <td className="px-4 py-2 text-gray-600">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-400">
        La contraseña de cada usuario se establece al crearlo; después, cada
        persona puede cambiar la suya desde Ajustes.
      </p>
    </div>
  );
}
