import type { DominantFoot, PlayerAvailability } from "@/app/generated/prisma/enums";

export function displayName(player: { name: string; nickname?: string | null }): string {
  return player.nickname || player.name;
}

export function parsePlayerForm(formData: FormData) {
  const birthDate = formData.get("birthDate") as string;
  const dominantFoot = formData.get("dominantFoot") as string;
  const availability = formData.get("availability") as string;

  return {
    name: formData.get("name") as string,
    nickname: (formData.get("nickname") as string) || null,
    position: (formData.get("position") as string) || null,
    secondaryPosition: (formData.get("secondaryPosition") as string) || null,
    birthDate: birthDate ? new Date(birthDate) : null,
    dominantFoot: dominantFoot ? (dominantFoot as DominantFoot) : null,
    phone: (formData.get("phone") as string) || null,
    club: (formData.get("club") as string) || null,
    onTrial: formData.get("onTrial") === "on",
    enrolled: formData.get("enrolled") === "on",
    availability: (availability || "DISPONIBLE") as PlayerAvailability,
  };
}
