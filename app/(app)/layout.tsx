import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/lib/auth";

// Todas las páginas de la app leen datos en vivo de la base de datos y
// requieren sesión; nunca deben servirse como HTML estático prerenderizado.
export const dynamic = "force-dynamic";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/plantilla", label: "Plantilla" },
  { href: "/entrenamientos", label: "Entrenamientos" },
  { href: "/partidos", label: "Partidos" },
  { href: "/base-datos", label: "Base de datos" },
  { href: "/listados", label: "Listados" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pitch-bg flex min-h-screen flex-col">
      <header className="pitch-header shadow-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="font-heading text-xl font-semibold tracking-wide text-white">
            ⚽ Club Fútbol
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/ajustes"
              className="text-sm text-green-100 hover:text-white"
            >
              Ajustes
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="text-sm text-green-100 hover:text-white"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-green-50 hover:bg-white/15 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400" />
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
