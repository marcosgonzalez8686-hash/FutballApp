export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(
    new Date(date)
  );
}

export function formatDateWithWeekday(date: Date | string): string {
  const d = new Date(date);
  const datePart = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(d);
  const weekday = new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(d);
  return `${datePart} (${weekday})`;
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function toDateTimeLocalValue(date: Date | string): string {
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function toDateInputValue(date: Date | string): string {
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
