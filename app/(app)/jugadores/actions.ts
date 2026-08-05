"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { DominantFoot } from "@/app/generated/prisma/enums";

function parsePlayerForm(formData: FormData) {
  const birthDate = formData.get("birthDate") as string;
  const dominantFoot = formData.get("dominantFoot") as string;

  return {
    name: formData.get("name") as string,
    nickname: (formData.get("nickname") as string) || null,
    position: (formData.get("position") as string) || null,
    secondaryPosition: (formData.get("secondaryPosition") as string) || null,
    birthDate: birthDate ? new Date(birthDate) : null,
    dominantFoot: dominantFoot ? (dominantFoot as DominantFoot) : null,
    phone: (formData.get("phone") as string) || null,
  };
}

export async function createPlayer(formData: FormData) {
  const data = parsePlayerForm(formData);
  await prisma.player.create({ data });
  revalidatePath("/jugadores");
  redirect("/jugadores");
}

export async function updatePlayer(id: string, formData: FormData) {
  const data = parsePlayerForm(formData);
  await prisma.player.update({ where: { id }, data });
  revalidatePath("/jugadores");
  revalidatePath(`/jugadores/${id}`);
  redirect("/jugadores");
}

export async function deletePlayer(id: string) {
  await prisma.player.delete({ where: { id } });
  revalidatePath("/jugadores");
  redirect("/jugadores");
}
