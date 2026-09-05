"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function changePassword(
  _prevState: string | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return "Tienes que iniciar sesión de nuevo.";
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return "Rellena todos los campos.";
  }

  if (newPassword.length < 8) {
    return "La nueva contraseña debe tener al menos 8 caracteres.";
  }

  if (newPassword !== confirmPassword) {
    return "Las contraseñas nuevas no coinciden.";
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    return "Usuario no encontrado.";
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return "La contraseña actual no es correcta.";
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return "OK";
}

export async function changeSeason(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;

  await prisma.$transaction([
    prisma.season.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } }),
    prisma.season.create({ data: { name, isCurrent: true } }),
  ]);

  revalidatePath("/ajustes");
  revalidatePath("/");
  revalidatePath("/entrenamientos");
  revalidatePath("/partidos");
}
