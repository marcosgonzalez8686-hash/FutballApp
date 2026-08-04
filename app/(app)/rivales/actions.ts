"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function parseRivalForm(formData: FormData) {
  return {
    name: formData.get("name") as string,
    notes: (formData.get("notes") as string) || null,
  };
}

export async function createRival(formData: FormData) {
  const data = parseRivalForm(formData);
  await prisma.rival.create({ data });
  revalidatePath("/rivales");
  redirect("/rivales");
}

export async function updateRival(id: string, formData: FormData) {
  const data = parseRivalForm(formData);
  await prisma.rival.update({ where: { id }, data });
  revalidatePath("/rivales");
  revalidatePath(`/rivales/${id}`);
  redirect("/rivales");
}

export async function deleteRival(id: string) {
  await prisma.rival.delete({ where: { id } });
  revalidatePath("/rivales");
  redirect("/rivales");
}
