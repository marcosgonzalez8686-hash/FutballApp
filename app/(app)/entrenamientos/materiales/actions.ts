"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function parseMaterialForm(formData: FormData) {
  const quantity = formData.get("quantity") as string;

  return {
    name: formData.get("name") as string,
    quantity: quantity ? parseInt(quantity, 10) : null,
  };
}

export async function createMaterial(formData: FormData) {
  const data = parseMaterialForm(formData);
  await prisma.material.create({ data });
  revalidatePath("/entrenamientos/materiales");
  redirect("/entrenamientos/materiales");
}

export async function updateMaterial(id: string, formData: FormData) {
  const data = parseMaterialForm(formData);
  await prisma.material.update({ where: { id }, data });
  revalidatePath("/entrenamientos/materiales");
  revalidatePath(`/entrenamientos/materiales/${id}`);
  redirect("/entrenamientos/materiales");
}

export async function deleteMaterial(id: string) {
  await prisma.material.delete({ where: { id } });
  revalidatePath("/entrenamientos/materiales");
  redirect("/entrenamientos/materiales");
}
