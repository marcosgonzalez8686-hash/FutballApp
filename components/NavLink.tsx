"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

// Enlace de navegación que aplica un estilo distinto cuando corresponde a la
// sección en la que está el usuario (la ruta exacta o cualquier subruta).
export function NavLink({
  href,
  className,
  activeClassName,
  inactiveClassName,
  children,
}: {
  href: string;
  className: string;
  activeClassName: string;
  inactiveClassName: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");
  const ref = useRef<HTMLAnchorElement>(null);

  // En el móvil el menú se desplaza en horizontal: se asegura de que la
  // sección activa quede a la vista.
  useEffect(() => {
    if (isActive) {
      ref.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, [isActive]);

  return (
    <Link
      ref={ref}
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`${className} ${isActive ? activeClassName : inactiveClassName}`}
    >
      {children}
    </Link>
  );
}

// Pestañas de sección (Pendientes, Finalizados...) con los colores del club.
export function SectionTab({ href, children }: { href: string; children: ReactNode }) {
  return (
    <NavLink
      href={href}
      className="-mb-px whitespace-nowrap rounded-t-md border-b-2 px-3 py-2"
      activeClassName="border-club-red font-semibold text-green-800"
      inactiveClassName="border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    >
      {children}
    </NavLink>
  );
}
