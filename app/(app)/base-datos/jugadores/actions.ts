"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parsePlayerForm } from "@/lib/players";

export async function createPlayer(formData: FormData) {
  const data = parsePlayerForm(formData);
  await prisma.player.create({ data: { ...data, inSquad: false } });
  revalidatePath("/base-datos/jugadores");
  redirect("/base-datos/jugadores");
}

export async function updatePlayer(id: string, formData: FormData) {
  const data = parsePlayerForm(formData);
  await prisma.player.update({ where: { id }, data });
  revalidatePath("/base-datos/jugadores");
  revalidatePath(`/base-datos/jugadores/${id}`);
  redirect("/base-datos/jugadores");
}

export async function addToSquad(id: string) {
  await prisma.player.update({ where: { id }, data: { inSquad: true } });
  revalidatePath("/base-datos/jugadores");
  revalidatePath(`/base-datos/jugadores/${id}`);
  revalidatePath("/plantilla");
}

export async function removeFromSquad(id: string) {
  await prisma.player.update({ where: { id }, data: { inSquad: false } });
  revalidatePath("/base-datos/jugadores");
  revalidatePath(`/base-datos/jugadores/${id}`);
  revalidatePath("/plantilla");
}

export async function deletePlayer(id: string) {
  await prisma.player.delete({ where: { id } });
  revalidatePath("/base-datos/jugadores");
  revalidatePath("/plantilla");
  redirect("/base-datos/jugadores");
}
