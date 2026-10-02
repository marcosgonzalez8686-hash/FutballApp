import type { ReactNode } from "react";
import { SectionTab } from "@/components/NavLink";

const tabs = [
  { href: "/base-datos/jugadores", label: "Jugadores" },
  { href: "/base-datos/entrenadores", label: "Entrenadores" },
  { href: "/base-datos/arbitros", label: "Árbitros" },
  { href: "/base-datos/clubes", label: "Clubes" },
];

export default function BaseDatosLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Base de datos</h1>
        <div className="mt-3 flex gap-1 border-b border-gray-200 text-sm">
          {tabs.map((tab) => (
            <SectionTab key={tab.href} href={tab.href}>
              {tab.label}
            </SectionTab>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
