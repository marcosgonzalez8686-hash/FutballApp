"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { FineReason } from "@/app/generated/prisma/enums";

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
  const reason = formData.get("reason") as FineReason;
  const comment = (formData.get("comment") as string) || null;

  if (!playerId || !amountRaw || !reason) return;

  await prisma.fine.create({
    data: {
      playerId,
      amount: parseFloat(amountRaw),
      reason,
      comment,
    },
  });

  revalidatePath("/plantilla/multas/pendientes");
  redirect("/plantilla/multas/pendientes");
}
