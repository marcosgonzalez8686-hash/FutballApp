"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parseConceptId } from "@/lib/fines";

export async function toggleFinePaid(fineId: string, formData: FormData) {
  const paid = formData.has("paid");
  await prisma.fine.update({ where: { id: fineId }, data: { paid } });
  revalidatePath("/plantilla/multas/pendientes");
  revalidatePath("/plantilla/multas/cobradas");
}

export async function markAllFinesPaidForPlayer(playerId: string) {
  await prisma.fine.updateMany({
    where: { playerId, paid: false },
    data: { paid: true },
  });
  revalidatePath("/plantilla/multas/pendientes");
  revalidatePath("/plantilla/multas/cobradas");
}

export async function createStandaloneFine(formData: FormData) {
  const playerId = formData.get("playerId") as string;
  const amountRaw = formData.get("amount") as string;
  const conceptId = parseConceptId(formData);
  const comment = (formData.get("comment") as string) || null;

  if (!playerId || !amountRaw) return;

  await prisma.fine.create({
    data: {
      playerId,
      amount: parseFloat(amountRaw),
      conceptId,
      comment,
    },
  });

  revalidatePath("/plantilla/multas/pendientes");
  redirect("/plantilla/multas/pendientes");
}

function parseFineConceptForm(formData: FormData) {
  return {
    name: formData.get("name") as string,
    category: (formData.get("category") as string) || null,
    amount: parseFloat(formData.get("amount") as string),
  };
}

export async function createFineConcept(formData: FormData) {
  const data = parseFineConceptForm(formData);
  if (!data.name || Number.isNaN(data.amount)) return;

  await prisma.fineConcept.create({ data });
  revalidatePath("/plantilla/multas/conceptos");
  redirect("/plantilla/multas/conceptos");
}

export async function updateFineConcept(conceptId: string, formData: FormData) {
  const data = parseFineConceptForm(formData);
  if (!data.name || Number.isNaN(data.amount)) return;

  await prisma.fineConcept.update({ where: { id: conceptId }, data });
  revalidatePath("/plantilla/multas/conceptos");
  redirect("/plantilla/multas/conceptos");
}

export async function deleteFineConcept(conceptId: string) {
  await prisma.fineConcept.delete({ where: { id: conceptId } });
  revalidatePath("/plantilla/multas/conceptos");
  redirect("/plantilla/multas/conceptos");
}
