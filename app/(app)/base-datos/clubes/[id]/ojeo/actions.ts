"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function parseScoutingForm(formData: FormData) {
  const date = formData.get("date") as string;

  return {
    date: date ? new Date(date) : null,
    scoutName: (formData.get("scoutName") as string) || null,
    opponent: (formData.get("opponent") as string) || null,
    bpOfensivo: (formData.get("bpOfensivo") as string) || null,
    bpDefensivo: (formData.get("bpDefensivo") as string) || null,
    salidaBalon: (formData.get("salidaBalon") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };
}

export async function createScouting(rivalId: string, formData: FormData) {
  const data = parseScoutingForm(formData);
  if (!data.date) return;

  await prisma.scouting.create({
    data: { rivalId, ...data, date: data.date },
  });

  revalidatePath(`/base-datos/clubes/${rivalId}/ojeo/lista`);
  redirect(`/base-datos/clubes/${rivalId}/ojeo/lista`);
}

export async function updateScouting(
  scoutingId: string,
  rivalId: string,
  formData: FormData
) {
  const data = parseScoutingForm(formData);
  if (!data.date) return;

  await prisma.scouting.update({
    where: { id: scoutingId },
    data: { ...data, date: data.date },
  });

  revalidatePath(`/base-datos/clubes/${rivalId}/ojeo/lista`);
  redirect(`/base-datos/clubes/${rivalId}/ojeo/lista`);
}

export async function deleteScouting(scoutingId: string, rivalId: string) {
  await prisma.scouting.delete({ where: { id: scoutingId } });
  revalidatePath(`/base-datos/clubes/${rivalId}/ojeo/lista`);
}
