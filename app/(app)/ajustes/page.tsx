import Link from "next/link";
import { auth } from "@/lib/auth";
import { ChangePasswordForm } from "./ChangePasswordForm";

export default async function AjustesPage() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Ajustes</h1>

      <div className="max-w-md rounded-lg border border-gray-200 bg-white p-6">
        <p className="mb-4 text-sm text-gray-500">
          Sesión iniciada como {session?.user?.email}
        </p>
        <ChangePasswordForm />
      </div>

      <div className="max-w-md rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-1 text-sm font-medium text-gray-900">Usuarios</h2>
        <p className="mb-4 text-sm text-gray-500">
          Gestiona quién puede acceder a la app.
        </p>
        <Link
          href="/usuarios"
          className="inline-block rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Gestionar usuarios
        </Link>
      </div>
    </div>
  );
}
