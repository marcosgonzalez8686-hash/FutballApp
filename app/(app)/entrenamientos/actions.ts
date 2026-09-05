"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { AttendanceStatus } from "@/app/generated/prisma/enums";
import { parseConceptId } from "@/lib/fines";
import { getCurrentSeasonId } from "@/lib/season";

function parseTrainingForm(formData: FormData) {
  const date = formData.get("date") as string;

  return {
    date: new Date(date),
    notes: (formData.get("notes") as string) || null,
  };
}

async function recalculateDuration(trainingId: string) {
  const items = await prisma.trainingExercise.findMany({
    where: { trainingId },
  });
  const total = items.reduce((sum, item) => sum + (item.duration ?? 0), 0);
  await prisma.training.update({
    where: { id: trainingId },
    data: { duration: total },
  });
}

export async function createTraining(formData: FormData) {
  const data = parseTrainingForm(formData);
  const seasonId = await getCurrentSeasonId();
  const training = await prisma.training.create({ data: { ...data, seasonId } });
  revalidatePath("/entrenamientos");
  redirect(`/entrenamientos/${training.id}`);
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

  revalidatePath(`/entrenamientos/${trainingId}/asistencia`);
  redirect(`/entrenamientos/${trainingId}`);
}

export async function addCatalogExercise(trainingId: string, formData: FormData) {
  const exerciseId = formData.get("exerciseId") as string;
  if (!exerciseId) return;

  const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!exercise) return;

  await prisma.trainingExercise.create({
    data: {
      trainingId,
      exerciseId,
      name: exercise.name,
      duration: exercise.duration,
    },
  });
  await recalculateDuration(trainingId);
  revalidatePath(`/entrenamientos/${trainingId}/ejercicios`);
  revalidatePath(`/entrenamientos/${trainingId}`);
}

export async function addManualExercise(trainingId: string, formData: FormData) {
  const name = (formData.get("manualName") as string)?.trim();
  if (!name) return;

  const durationRaw = formData.get("manualDuration") as string;
  const duration = durationRaw ? parseInt(durationRaw, 10) : null;

  await prisma.trainingExercise.create({
    data: { trainingId, exerciseId: null, name, duration },
  });
  await recalculateDuration(trainingId);
  revalidatePath(`/entrenamientos/${trainingId}/ejercicios`);
  revalidatePath(`/entrenamientos/${trainingId}`);
}

export async function removeTrainingExercise(
  trainingExerciseId: string,
  trainingId: string
) {
  await prisma.trainingExercise.delete({ where: { id: trainingExerciseId } });
  await recalculateDuration(trainingId);
  revalidatePath(`/entrenamientos/${trainingId}/ejercicios`);
  revalidatePath(`/entrenamientos/${trainingId}`);
}

export async function toggleMaterialCollected(
  trainingId: string,
  materialId: string,
  formData: FormData
) {
  const collected = formData.has("collected");

  await prisma.trainingMaterialCheck.upsert({
    where: { trainingId_materialId: { trainingId, materialId } },
    update: { collected },
    create: { trainingId, materialId, collected },
  });

  revalidatePath(`/entrenamientos/${trainingId}/material`);
}

export async function addTrainingFine(trainingId: string, formData: FormData) {
  const playerId = formData.get("playerId") as string;
  const amountRaw = formData.get("amount") as string;
  const conceptId = parseConceptId(formData);
  const comment = (formData.get("comment") as string) || null;

  if (!playerId || !amountRaw) return;

  await prisma.fine.create({
    data: {
      playerId,
      trainingId,
      amount: parseFloat(amountRaw),
      conceptId,
      comment,
    },
  });

  revalidatePath(`/entrenamientos/${trainingId}/multas`);
  revalidatePath(`/entrenamientos/${trainingId}`);
}

export async function deleteTrainingFine(fineId: string, trainingId: string) {
  await prisma.fine.delete({ where: { id: fineId } });
  revalidatePath(`/entrenamientos/${trainingId}/multas`);
  revalidatePath(`/entrenamientos/${trainingId}`);
}
