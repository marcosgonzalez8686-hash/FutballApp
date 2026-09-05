"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createScouting(rivalId: string, formData: FormData) {
  const date = formData.get("date") as string;
  const scoutName = (formData.get("scoutName") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  if (!date) return;

  await prisma.scouting.create({
    data: { rivalId, date: new Date(date), scoutName, notes },
  });

  revalidatePath(`/base-datos/clubes/${rivalId}/ojeo/lista`);
  redirect(`/base-datos/clubes/${rivalId}/ojeo/lista`);
}

export async function deleteScouting(scoutingId: string, rivalId: string) {
  await prisma.scouting.delete({ where: { id: scoutingId } });
  revalidatePath(`/base-datos/clubes/${rivalId}/ojeo/lista`);
}
