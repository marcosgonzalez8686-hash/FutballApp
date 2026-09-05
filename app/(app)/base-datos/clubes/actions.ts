"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function parseRivalForm(formData: FormData) {
  return {
    name: formData.get("name") as string,
    contact: (formData.get("contact") as string) || null,
    venue: (formData.get("venue") as string) || null,
    address: (formData.get("address") as string) || null,
    phone: (formData.get("phone") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };
}

export async function createRival(formData: FormData) {
  const data = parseRivalForm(formData);
  await prisma.rival.create({ data });
  revalidatePath("/base-datos/clubes");
  redirect("/base-datos/clubes");
}

export async function updateRival(id: string, formData: FormData) {
  const data = parseRivalForm(formData);
  await prisma.rival.update({ where: { id }, data });
  revalidatePath("/base-datos/clubes");
  revalidatePath(`/base-datos/clubes/${id}`);
  redirect("/base-datos/clubes");
}

export async function deleteRival(id: string) {
  await prisma.rival.delete({ where: { id } });
  revalidatePath("/base-datos/clubes");
  redirect("/base-datos/clubes");
}
