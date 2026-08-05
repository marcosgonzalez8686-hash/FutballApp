"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createUser(
  _prevState: string | undefined,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return "Rellena todos los campos.";
  }
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return "Ya existe un usuario con ese email.";
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, passwordHash } });
  revalidatePath("/usuarios");
  redirect("/usuarios");
}

export async function updateUser(
  id: string,
  _prevState: string | undefined,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || !email) {
    return "Rellena todos los campos.";
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== id) {
    return "Ya existe otro usuario con ese email.";
  }

  await prisma.user.update({ where: { id }, data: { name, email } });
  revalidatePath("/usuarios");
  redirect("/usuarios");
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
  revalidatePath("/usuarios");
  redirect("/usuarios");
}
