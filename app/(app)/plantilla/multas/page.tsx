import Link from "next/link";

export default function GestionMultasPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Gestión de multas</h1>

      <Link
        href="/plantilla/multas/pendientes/nueva"
        className="max-w-lg rounded-md bg-green-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-800"
      >
        Nueva multa
      </Link>

      <div className="flex max-w-lg flex-col gap-3">
        <Link
          href="/plantilla/multas/pendientes"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Pendientes</p>
          <p className="text-sm text-gray-500">
            Multas pendientes de cobro, agrupadas por jugador
          </p>
        </Link>

        <Link
          href="/plantilla/multas/cobradas"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Cobradas</p>
          <p className="text-sm text-gray-500">
            Importe cobrado por jugador
          </p>
        </Link>

        <Link
          href="/plantilla/multas/conceptos"
          className="rounded-lg border border-gray-200 bg-white p-6 hover:border-green-600"
        >
          <p className="font-medium text-gray-900">Conceptos de multa</p>
          <p className="text-sm text-gray-500">
            Catálogo de motivos e importes por defecto
          </p>
        </Link>
      </div>

      <Link
        href="/plantilla"
        className="max-w-lg rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Volver
      </Link>
    </div>
  );
}
