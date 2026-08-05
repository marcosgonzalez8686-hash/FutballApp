"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function parseRefereeForm(formData: FormData) {
  return {
    name: formData.get("name") as string,
    notes: (formData.get("notes") as string) || null,
  };
}

export async function createReferee(formData: FormData) {
  const data = parseRefereeForm(formData);
  await prisma.referee.create({ data });
  revalidatePath("/base-datos/arbitros");
  redirect("/base-datos/arbitros");
}

export async function updateReferee(id: string, formData: FormData) {
  const data = parseRefereeForm(formData);
  await prisma.referee.update({ where: { id }, data });
  revalidatePath("/base-datos/arbitros");
  revalidatePath(`/base-datos/arbitros/${id}`);
  redirect("/base-datos/arbitros");
}

export async function deleteReferee(id: string) {
  await prisma.referee.delete({ where: { id } });
  revalidatePath("/base-datos/arbitros");
  redirect("/base-datos/arbitros");
}
