"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function parseExerciseForm(formData: FormData) {
  const duration = formData.get("duration") as string;

  return {
    name: formData.get("name") as string,
    duration: duration ? parseInt(duration, 10) : null,
    explanation: (formData.get("explanation") as string) || null,
  };
}

function parseMaterialIds(formData: FormData) {
  return formData.getAll("materialIds") as string[];
}

export async function createExercise(formData: FormData) {
  const data = parseExerciseForm(formData);
  const materialIds = parseMaterialIds(formData);

  await prisma.exercise.create({
    data: {
      ...data,
      materials: {
        create: materialIds.map((materialId) => ({ materialId })),
      },
    },
  });
  revalidatePath("/entrenamientos/ejercicios");
  redirect("/entrenamientos/ejercicios");
}

export async function updateExercise(id: string, formData: FormData) {
  const data = parseExerciseForm(formData);
  const materialIds = parseMaterialIds(formData);

  await prisma.$transaction([
    prisma.exercise.update({ where: { id }, data }),
    prisma.exerciseMaterial.deleteMany({ where: { exerciseId: id } }),
    prisma.exerciseMaterial.createMany({
      data: materialIds.map((materialId) => ({ exerciseId: id, materialId })),
    }),
  ]);

  revalidatePath("/entrenamientos/ejercicios");
  revalidatePath(`/entrenamientos/ejercicios/${id}`);
  redirect("/entrenamientos/ejercicios");
}

export async function deleteExercise(id: string) {
  await prisma.exercise.delete({ where: { id } });
  revalidatePath("/entrenamientos/ejercicios");
  redirect("/entrenamientos/ejercicios");
}
