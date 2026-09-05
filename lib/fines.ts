export function parseConceptId(formData: FormData): string | null {
  const conceptId = formData.get("conceptId") as string;
  return conceptId && conceptId !== "OTRO" ? conceptId : null;
}

export const AUTO_FINE_CONCEPT_BY_STATUS: Record<string, string> = {
  TARDE: "tarde-entreno",
  AUSENCIA_NO_JUSTIFICADA: "falta-aviso-entreno",
};
