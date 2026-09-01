import { redirect } from "next/navigation";

export default function PartidosIndexPage() {
  redirect("/partidos/pendientes");
}
