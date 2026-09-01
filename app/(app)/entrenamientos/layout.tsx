import Link from "next/link";
import type { ReactNode } from "react";

const tabs = [
  { href: "/entrenamientos/pendientes", label: "Pendientes" },
  { href: "/entrenamientos/finalizados", label: "Finalizados" },
  { href: "/entrenamientos/ejercicios", label: "Ejercicios" },
  { href: "/entrenamientos/materiales", label: "Materiales" },
];

export default function EntrenamientosLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Entrenamientos</h1>
        <div className="mt-3 flex gap-1 border-b border-gray-200 text-sm">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="whitespace-nowrap rounded-t-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
