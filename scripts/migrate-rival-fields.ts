import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PREFIXES: { key: "contact" | "venue" | "address" | "phone"; prefix: string }[] = [
  { key: "contact", prefix: "Contacto: " },
  { key: "venue", prefix: "Campo: " },
  { key: "address", prefix: "Dirección: " },
  { key: "phone", prefix: "Teléfono: " },
];

async function main() {
  const rivals = await prisma.rival.findMany();

  let updated = 0;

  for (const rival of rivals) {
    if (!rival.notes) continue;

    const lines = rival.notes.split("\n");
    const extracted: Record<string, string> = {};
    const leftover: string[] = [];

    for (const line of lines) {
      const match = PREFIXES.find((p) => line.startsWith(p.prefix));
      if (match) {
        extracted[match.key] = line.slice(match.prefix.length).trim();
      } else if (line.trim()) {
        leftover.push(line);
      }
    }

    if (Object.keys(extracted).length === 0) continue;

    await prisma.rival.update({
      where: { id: rival.id },
      data: {
        contact: extracted.contact ?? null,
        venue: extracted.venue ?? null,
        address: extracted.address ?? null,
        phone: extracted.phone ?? null,
        notes: leftover.length > 0 ? leftover.join("\n") : null,
      },
    });
    console.log(`Actualizado: ${rival.name}`);
    updated++;
  }

  console.log(`\nTotal: ${updated} clubes actualizados de ${rivals.length}.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
