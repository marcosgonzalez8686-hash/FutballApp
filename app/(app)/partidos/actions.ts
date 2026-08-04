"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { MatchStatus } from "@/app/generated/prisma/enums";

function parseMatchForm(formData: FormData) {
  const ourScore = formData.get("ourScore") as string;
  const rivalScore = formData.get("rivalScore") as string;

  return {
    rivalId: formData.get("rivalId") as string,
    date: new Date(formData.get("date") as string),
    isHome: formData.get("isHome") === "true",
    ourScore: ourScore ? parseInt(ourScore, 10) : null,
    rivalScore: rivalScore ? parseInt(rivalScore, 10) : null,
    status: formData.get("status") as MatchStatus,
    notes: (formData.get("notes") as string) || null,
  };
}

export async function createMatch(formData: FormData) {
  const data = parseMatchForm(formData);
  await prisma.match.create({ data });
  revalidatePath("/partidos");
  redirect("/partidos");
}

export async function updateMatch(id: string, formData: FormData) {
  const data = parseMatchForm(formData);
  await prisma.match.update({ where: { id }, data });
  revalidatePath("/partidos");
  revalidatePath(`/partidos/${id}`);
  redirect(`/partidos/${id}`);
}

export async function deleteMatch(id: string) {
  await prisma.match.delete({ where: { id } });
  revalidatePath("/partidos");
  redirect("/partidos");
}
