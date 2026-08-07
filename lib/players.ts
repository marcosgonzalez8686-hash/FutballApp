import type { DominantFoot } from "@/app/generated/prisma/enums";

export function parsePlayerForm(formData: FormData) {
  const birthDate = formData.get("birthDate") as string;
  const dominantFoot = formData.get("dominantFoot") as string;

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
  };
}
