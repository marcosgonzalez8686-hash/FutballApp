import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/lib/auth";

// Todas las páginas de la app leen datos en vivo de la base de datos y
// requieren sesión; nunca deben servirse como HTML estático prerenderizado.
export const dynamic = "force-dynamic";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/jugadores", label: "Jugadores" },
  { href: "/entrenamientos", label: "Entrenamientos" },
  { href: "/partidos", label: "Partidos" },
  { href: "/rivales", label: "Rivales" },
  { href: "/usuarios", label: "Usuarios" },
  { href: "/ajustes", label: "Ajustes" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="font-semibold text-gray-900">Club Fútbol</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Salir
            </button>
          </form>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
