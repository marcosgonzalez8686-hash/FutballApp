"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function parseCoachForm(formData: FormData) {
  return {
    name: formData.get("name") as string,
    club: (formData.get("club") as string) || null,
    formation: (formData.get("formation") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };
}

export async function createCoach(formData: FormData) {
  const data = parseCoachForm(formData);
  await prisma.coach.create({ data });
  revalidatePath("/base-datos/entrenadores");
  redirect("/base-datos/entrenadores");
}

export async function updateCoach(id: string, formData: FormData) {
  const data = parseCoachForm(formData);
  await prisma.coach.update({ where: { id }, data });
  revalidatePath("/base-datos/entrenadores");
  revalidatePath(`/base-datos/entrenadores/${id}`);
  redirect("/base-datos/entrenadores");
}

export async function deleteCoach(id: string) {
  await prisma.coach.delete({ where: { id } });
  revalidatePath("/base-datos/entrenadores");
  redirect("/base-datos/entrenadores");
}
