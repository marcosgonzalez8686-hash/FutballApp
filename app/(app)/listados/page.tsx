import Link from "next/link";

export default function ListadosPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Listados</h1>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/listados/asistencia"
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Asistencia a entrenamientos</p>
          <p className="text-sm text-gray-500">
            Consulta quién ha asistido, filtrando por fecha
          </p>
        </Link>
      </div>
    </div>
  );
}
