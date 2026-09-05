import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Lunes(1), martes(2) y jueves(4)
const TARGET_WEEKDAYS = [1, 2, 4];

const START = new Date("2026-09-01");
const END = new Date("2027-05-31");

function toDateOnly(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

async function main() {
  const dates: Date[] = [];
  for (
    let d = toDateOnly(START);
    d.getTime() <= toDateOnly(END).getTime();
    d.setUTCDate(d.getUTCDate() + 1)
  ) {
    if (TARGET_WEEKDAYS.includes(d.getUTCDay())) {
      dates.push(new Date(d));
    }
  }

  let created = 0;
  let skipped = 0;

  for (const date of dates) {
    const existing = await prisma.training.findFirst({ where: { date } });
    if (existing) {
      skipped++;
      continue;
    }
    await prisma.training.create({ data: { date, seasonId: "season-2026-2027" } });
    created++;
  }

  console.log(`Total: ${dates.length} fechas procesadas, ${created} creados, ${skipped} ya existían.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
