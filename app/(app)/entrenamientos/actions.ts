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

export async function addCatalogExercise(trainingId: string, formData: FormData) {
  const exerciseId = formData.get("exerciseId") as string;
  if (!exerciseId) return;

  const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!exercise) return;

  await prisma.trainingExercise.create({
    data: { trainingId, exerciseId, name: exercise.name },
  });
  revalidatePath(`/entrenamientos/${trainingId}`);
}

export async function addManualExercise(trainingId: string, formData: FormData) {
  const name = (formData.get("manualName") as string)?.trim();
  if (!name) return;

  await prisma.trainingExercise.create({
    data: { trainingId, exerciseId: null, name },
  });
  revalidatePath(`/entrenamientos/${trainingId}`);
}

export async function removeTrainingExercise(
  trainingExerciseId: string,
  trainingId: string
) {
  await prisma.trainingExercise.delete({ where: { id: trainingExerciseId } });
  revalidatePath(`/entrenamientos/${trainingId}`);
}
