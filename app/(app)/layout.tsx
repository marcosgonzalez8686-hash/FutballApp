import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/lib/auth";
import { NavLink } from "@/components/NavLink";

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
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/escudo.png"
              alt="Escudo AD Lavadores"
              width={31}
              height={44}
              priority
              className="h-11 w-auto drop-shadow-md"
            />
            <span className="font-heading text-xl font-semibold tracking-wide text-white">
              AD Lavadores
            </span>
          </Link>
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
            <NavLink
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-1.5 font-medium"
              activeClassName="bg-white/20 text-white shadow-[inset_0_-3px_0_var(--color-club-gold)]"
              inactiveClassName="text-green-50 hover:bg-white/15 hover:text-white"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="club-stripe" />
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
