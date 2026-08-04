"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { AttendanceStatus } from "@/app/generated/prisma/enums";

function parseTrainingForm(formData: FormData) {
  const date = formData.get("date") as string;
  const duration = formData.get("duration") as string;

  return {
    date: new Date(date),
    exercise: (formData.get("exercise") as string) || null,
    duration: duration ? parseInt(duration, 10) : null,
    notes: (formData.get("notes") as string) || null,
  };
}

export async function createTraining(formData: FormData) {
  const data = parseTrainingForm(formData);
  await prisma.training.create({ data });
  revalidatePath("/entrenamientos");
  redirect("/entrenamientos");
}

export async function updateTraining(id: string, formData: FormData) {
  const data = parseTrainingForm(formData);
  await prisma.training.update({ where: { id }, data });
  revalidatePath("/entrenamientos");
  revalidatePath(`/entrenamientos/${id}`);
  redirect(`/entrenamientos/${id}`);
}

export async function deleteTraining(id: string) {
  await prisma.training.delete({ where: { id } });
  revalidatePath("/entrenamientos");
  redirect("/entrenamientos");
}

export async function saveAttendance(trainingId: string, formData: FormData) {
  const entries = Array.from(formData.entries()).filter(([key]) =>
    key.startsWith("status-")
  );

  await Promise.all(
    entries.map(([key, value]) => {
      const playerId = key.replace("status-", "");
      return prisma.trainingAttendance.upsert({
        where: { trainingId_playerId: { trainingId, playerId } },
        update: { status: value as AttendanceStatus },
        create: { trainingId, playerId, status: value as AttendanceStatus },
      });
    })
  );

  revalidatePath(`/entrenamientos/${trainingId}`);
  redirect(`/entrenamientos/${trainingId}`);
}
