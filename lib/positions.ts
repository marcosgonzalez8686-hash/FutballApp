export const PLAYER_POSITIONS = [
  "POR",
  "DFC",
  "LTD",
  "LTI",
  "MDC",
  "MPC",
  "EXD",
  "EXI",
  "DEL",
] as const;

export const POSITION_GROUPS = [
  { label: "Porteros", positions: ["POR"] },
  { label: "Defensas", positions: ["DFC", "LTD", "LTI"] },
  { label: "Centrocampistas", positions: ["MDC", "MPC"] },
  { label: "Delanteros", positions: ["EXD", "EXI", "DEL"] },
] as const;
