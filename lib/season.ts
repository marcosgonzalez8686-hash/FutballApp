import { prisma } from "@/lib/prisma";

export async function getCurrentSeason() {
  const season = await prisma.season.findFirst({ where: { isCurrent: true } });
  if (!season) {
    throw new Error("No hay ninguna temporada marcada como vigente.");
  }
  return season;
}

export async function getCurrentSeasonId() {
  const season = await getCurrentSeason();
  return season.id;
}
