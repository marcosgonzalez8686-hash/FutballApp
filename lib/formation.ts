export const FORMATION_ROWS = [
  { key: "DEL", label: "Delanteros", count: 3, top: 10 },
  { key: "MP", label: "Mediapunta", count: 5, top: 28 },
  { key: "MC", label: "Medio campo", count: 5, top: 46 },
  { key: "CARR", label: "Carrileros / mediocentro", count: 5, top: 64 },
  { key: "DEF", label: "Defensas", count: 5, top: 80 },
  { key: "POR", label: "Portero", count: 1, top: 93 },
] as const;

export type FormationRowKey = (typeof FORMATION_ROWS)[number]["key"];

export const ROW_POSITIONS: Record<FormationRowKey, string[]> = {
  POR: ["POR"],
  DEF: ["DFC", "LTD", "LTI"],
  CARR: ["LTD", "LTI", "MDC"],
  MC: ["MDC", "MPC"],
  MP: ["MPC", "EXD", "EXI"],
  DEL: ["DEL"],
};

export function rowKeyFromSlotId(slotId: string): FormationRowKey | null {
  const key = slotId.split("-")[0];
  return (FORMATION_ROWS.find((r) => r.key === key)?.key as FormationRowKey) ?? null;
}

export function matchesRow(
  rowKey: FormationRowKey,
  position: string | null,
  secondaryPosition: string | null
): boolean {
  const valid = ROW_POSITIONS[rowKey];
  return (position !== null && valid.includes(position)) ||
    (secondaryPosition !== null && valid.includes(secondaryPosition));
}

export function allSlotIds(): string[] {
  return FORMATION_ROWS.flatMap((row) =>
    Array.from({ length: row.count }, (_, i) => `${row.key}-${i}`)
  );
}

export function slotPosition(slotId: string): { top: number; left: number } | null {
  const [key, indexRaw] = slotId.split("-");
  const row = FORMATION_ROWS.find((r) => r.key === key);
  if (!row) return null;
  const index = Number(indexRaw);
  if (Number.isNaN(index) || index < 0 || index >= row.count) return null;

  const left =
    row.count === 1 ? 50 : 12 + ((88 - 12) * index) / (row.count - 1);

  return { top: row.top, left };
}

export const TOTAL_LINEUP_DOLLS = 11;
