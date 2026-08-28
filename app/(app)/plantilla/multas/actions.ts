"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function toggleFinePaid(
  fineId: string,
  playerId: string,
  formData: FormData
) {
  const paid = formData.has("paid");
  await prisma.fine.update({ where: { id: fineId }, data: { paid } });
  revalidatePath(`/plantilla/multas/${playerId}`);
  revalidatePath("/plantilla/multas");
}
