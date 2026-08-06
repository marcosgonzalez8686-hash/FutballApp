"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parsePlayerForm } from "@/lib/players";

export async function createPlayer(formData: FormData) {
  const data = parsePlayerForm(formData);
  await prisma.player.create({ data: { ...data, inSquad: true } });
  revalidatePath("/plantilla");
  redirect("/plantilla");
}

export async function updatePlayer(id: string, formData: FormData) {
  const data = parsePlayerForm(formData);
  await prisma.player.update({ where: { id }, data });
  revalidatePath("/plantilla");
  revalidatePath(`/plantilla/${id}`);
  redirect("/plantilla");
}

export async function removeFromSquad(id: string) {
  await prisma.player.update({ where: { id }, data: { inSquad: false } });
  revalidatePath("/plantilla");
  revalidatePath("/base-datos/jugadores");
  redirect("/plantilla");
}

export async function toggleAvailability(playerId: string, formData: FormData) {
  const available = !formData.has("unavailable");
  await prisma.player.update({ where: { id: playerId }, data: { available } });
  revalidatePath("/plantilla");
  revalidatePath("/plantilla/disponibilidad");
}
