"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type {
  MatchStatus,
  Competition,
  FineReason,
} from "@/app/generated/prisma/enums";

function parseMatchForm(formData: FormData) {
  const ourScore = formData.get("ourScore") as string;
  const rivalScore = formData.get("rivalScore") as string;

  return {
    rivalId: formData.get("rivalId") as string,
    date: new Date(formData.get("date") as string),
    isHome: formData.get("isHome") === "true",
    competition: formData.get("competition") as Competition,
    ourScore: ourScore ? parseInt(ourScore, 10) : null,
    rivalScore: rivalScore ? parseInt(rivalScore, 10) : null,
    status: formData.get("status") as MatchStatus,
    notes: (formData.get("notes") as string) || null,
  };
}

export async function createMatch(formData: FormData) {
  const data = parseMatchForm(formData);
  const match = await prisma.match.create({ data });
  revalidatePath("/partidos");
  redirect(`/partidos/${match.id}`);
}

export async function updateMatch(id: string, formData: FormData) {
  const data = parseMatchForm(formData);
  await prisma.match.update({ where: { id }, data });
  revalidatePath("/partidos");
  revalidatePath(`/partidos/${id}`);
  redirect(`/partidos/${id}`);
}

export async function deleteMatch(id: string) {
  await prisma.match.delete({ where: { id } });
  revalidatePath("/partidos");
  redirect("/partidos");
}

export async function saveCallups(matchId: string, formData: FormData) {
  const playerIds = Array.from(formData.entries())
    .filter(([key]) => key.startsWith("called-"))
    .map(([key]) => key.replace("called-", ""));

  const players = await prisma.player.findMany({
    where: { inSquad: true },
    select: { id: true },
  });

  await Promise.all(
    players.map((player) =>
      prisma.matchCallup.upsert({
        where: { matchId_playerId: { matchId, playerId: player.id } },
        update: { called: playerIds.includes(player.id) },
        create: { matchId, playerId: player.id, called: playerIds.includes(player.id) },
      })
    )
  );

  revalidatePath(`/partidos/${matchId}/convocatoria`);
  revalidatePath(`/partidos/${matchId}`);
  redirect(`/partidos/${matchId}`);
}

export async function toggleMatchUnavailable(
  matchId: string,
  playerId: string,
  formData: FormData
) {
  const unavailable = formData.has("unavailable");

  await prisma.matchCallup.upsert({
    where: { matchId_playerId: { matchId, playerId } },
    update: unavailable ? { unavailable, called: false } : { unavailable },
    create: { matchId, playerId, unavailable, called: false },
  });

  revalidatePath(`/partidos/${matchId}/no-disponibles`);
  revalidatePath(`/partidos/${matchId}/convocatoria`);
  revalidatePath(`/partidos/${matchId}`);
}

export async function addMatchFine(matchId: string, formData: FormData) {
  const playerId = formData.get("playerId") as string;
  const amountRaw = formData.get("amount") as string;
  const reason = formData.get("reason") as FineReason;
  const comment = (formData.get("comment") as string) || null;

  if (!playerId || !amountRaw || !reason) return;

  await prisma.fine.create({
    data: {
      playerId,
      matchId,
      amount: parseFloat(amountRaw),
      reason,
      comment,
    },
  });

  revalidatePath(`/partidos/${matchId}/multas`);
  revalidatePath(`/partidos/${matchId}`);
}

export async function deleteMatchFine(fineId: string, matchId: string) {
  await prisma.fine.delete({ where: { id: fineId } });
  revalidatePath(`/partidos/${matchId}/multas`);
  revalidatePath(`/partidos/${matchId}`);
}
