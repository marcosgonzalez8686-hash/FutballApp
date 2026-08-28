import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const rivals = [
  {
    name: "SAN MIGUEL C.F.",
    notes:
      "Contacto: Rafael Cambeiro\nCampo: A Pirucha (San Miguel) - Hierba Artificial\nDirección: San Miguel de Oya, 36390, Vigo (Pontevedra)\nTeléfono: 722396774",
  },
  {
    name: "SD SALVATERRA",
    notes:
      "Contacto: Edgar\nCampo: Antonio Bernárdez - Dextros (Salvaterra) - Hierba Natural\nDirección: Rosalía de Castro s/n, Salvaterra de Miño, 36450 (Pontevedra)\nTeléfono: 690864247",
  },
  {
    name: "C.D. LA GUIA",
    notes:
      "Campo: A Guía - Hierba Artificial\nDirección: La Guía - Teis, 36207, Vigo (Pontevedra)\nTeléfono: 678074021",
  },
  {
    name: "U.D. SANTA MARIÑA",
    notes:
      "Campo: Cotogrande - Hierba Artificial\nDirección: Cabral, 36318, Vigo (Pontevedra)\nTeléfono: 696916676",
  },
  {
    name: "CELTA 360",
    notes:
      "Contacto: Marcos Alonso\nCampo: I.D. A Madroa Campo 2 - Hierba Artificial\nDirección: A Madroa, 36317, Vigo (Pontevedra)\nTeléfono: 666038464",
  },
  {
    name: "MONDARIZ C.F.",
    notes:
      "Contacto: Carmen\nCampo: A Lagoa (Mondariz) - Hierba Natural\nDirección: Lagoa s/n, Mondariz, 36870 (Pontevedra)\nTeléfono: 627193754",
  },
  {
    name: "C.F. CAÑIZA",
    notes:
      "Contacto: Mónica Almuiña Paz\nCampo: Vieiro (Cañiza) - Hierba Natural\nDirección: Vieiro s/n, A Cañiza, 36880 (Pontevedra)\nTeléfono: 666700671",
  },
  {
    name: "C.F. GUILLAREI",
    notes:
      "Contacto: Manuel Rodríguez Rodríguez\nCampo: A Gándara (Guillarei) - Hierba Natural\nDirección: Guillarei, 36710, Tui (Pontevedra)\nTeléfono: 661240991",
  },
  {
    name: "CALDELAS C.D.",
    notes:
      "Contacto: Demelsa Gándara\nCampo: Foxo (Caldelas) - Hierba Artificial\nDirección: Caldelas de Tuy, 36460, Tui (Pontevedra)\nTeléfono: 696781877",
  },
  {
    name: "GONDOMAR F.B.",
    notes:
      "Contacto: José Blanco\nCampo: As Cercas (Gondomar) - Hierba Artificial\nDirección: Gondomar, 36380 (Pontevedra)\nTeléfono: 691682291",
  },
  {
    name: "U.V.C.D. CANDEAN",
    notes:
      "Contacto: María del Carmen Martínez Pazo\nCampo: A Madroa (José Costas) - Hierba Artificial\nDirección: A Madroa, 36216, Vigo (Pontevedra)\nTeléfono: 986376510",
  },
  {
    name: "ATLETICO VILLAR",
    notes:
      "Contacto: Fernando Darriba Ferrín\nCampo: San Martín (Villar) - Tierra\nDirección: Villar, 36815, Redondela (Pontevedra)\nTeléfono: 662592789",
  },
  {
    name: "TEBRA F.C.",
    notes:
      "Contacto: José Lorenzo Iglesias Núñez\nCampo: A Carballa (Tomiño) - Hierba Artificial\nDirección: Lugar Solleiro s/n, Tomiño, 36740 (Pontevedra)\nTeléfono: 699089988",
  },
  {
    name: "GOIAN C.F.",
    notes:
      "Campo: Lito Oliveira (Goián) - Hierba Artificial\nDirección: Goián, 36206, Tomiño (Pontevedra)\nTeléfono: 699218824",
  },
  {
    name: "C.D. VINCIOS",
    notes:
      "Campo: Pasaxe (Vincios) - Tierra\nDirección: Vincios, 36316, Gondomar (Pontevedra)\nTeléfono: 646548872",
  },
];

// Calendario de LAVADORES, temporada 2026-2027, 2ª FUTGAL Vigo
const matches: { jornada: number; date: string; opponent: string; isHome: boolean }[] = [
  { jornada: 1, date: "13-09-2026", opponent: "SD SALVATERRA", isHome: true },
  { jornada: 2, date: "20-09-2026", opponent: "U.D. SANTA MARIÑA", isHome: false },
  { jornada: 3, date: "27-09-2026", opponent: "MONDARIZ C.F.", isHome: true },
  { jornada: 4, date: "04-10-2026", opponent: "C.F. GUILLAREI", isHome: false },
  { jornada: 5, date: "18-10-2026", opponent: "GONDOMAR F.B.", isHome: true },
  { jornada: 6, date: "25-10-2026", opponent: "ATLETICO VILLAR", isHome: false },
  { jornada: 7, date: "01-11-2026", opponent: "GOIAN C.F.", isHome: true },
  { jornada: 8, date: "08-11-2026", opponent: "SAN MIGUEL C.F.", isHome: false },
  { jornada: 9, date: "15-11-2026", opponent: "C.D. LA GUIA", isHome: true },
  { jornada: 10, date: "22-11-2026", opponent: "CELTA 360", isHome: false },
  { jornada: 11, date: "29-11-2026", opponent: "C.F. CAÑIZA", isHome: true },
  { jornada: 12, date: "13-12-2026", opponent: "CALDELAS C.D.", isHome: false },
  { jornada: 13, date: "20-12-2026", opponent: "U.V.C.D. CANDEAN", isHome: true },
  { jornada: 14, date: "10-01-2027", opponent: "TEBRA F.C.", isHome: false },
  { jornada: 15, date: "17-01-2027", opponent: "C.D. VINCIOS", isHome: true },
  { jornada: 16, date: "24-01-2027", opponent: "SD SALVATERRA", isHome: false },
  { jornada: 17, date: "31-01-2027", opponent: "U.D. SANTA MARIÑA", isHome: true },
  { jornada: 18, date: "14-02-2027", opponent: "MONDARIZ C.F.", isHome: false },
  { jornada: 19, date: "21-02-2027", opponent: "C.F. GUILLAREI", isHome: true },
  { jornada: 20, date: "28-02-2027", opponent: "GONDOMAR F.B.", isHome: false },
  { jornada: 21, date: "07-03-2027", opponent: "ATLETICO VILLAR", isHome: true },
  { jornada: 22, date: "14-03-2027", opponent: "GOIAN C.F.", isHome: false },
  { jornada: 23, date: "21-03-2027", opponent: "SAN MIGUEL C.F.", isHome: true },
  { jornada: 24, date: "04-04-2027", opponent: "C.D. LA GUIA", isHome: false },
  { jornada: 25, date: "11-04-2027", opponent: "CELTA 360", isHome: true },
  { jornada: 26, date: "18-04-2027", opponent: "C.F. CAÑIZA", isHome: false },
  { jornada: 27, date: "25-04-2027", opponent: "CALDELAS C.D.", isHome: true },
  { jornada: 28, date: "02-05-2027", opponent: "U.V.C.D. CANDEAN", isHome: false },
  { jornada: 29, date: "09-05-2027", opponent: "TEBRA F.C.", isHome: true },
  { jornada: 30, date: "16-05-2027", opponent: "C.D. VINCIOS", isHome: false },
];

const DEFAULT_HOUR = 17;
const DEFAULT_MINUTE = 0;

function toMatchDate(ddmmyyyy: string): Date {
  const [day, month, year] = ddmmyyyy.split("-");
  const pad = (n: string) => n.padStart(2, "0");
  const hh = String(DEFAULT_HOUR).padStart(2, "0");
  const mm = String(DEFAULT_MINUTE).padStart(2, "0");
  return new Date(`${year}-${pad(month)}-${pad(day)}T${hh}:${mm}`);
}

async function main() {
  const rivalIdByName = new Map<string, string>();

  for (const r of rivals) {
    let rival = await prisma.rival.findFirst({ where: { name: r.name } });
    if (!rival) {
      rival = await prisma.rival.create({ data: { name: r.name, notes: r.notes } });
      console.log(`Creado club: ${r.name}`);
    } else {
      console.log(`Ya existía: ${r.name}`);
    }
    rivalIdByName.set(r.name, rival.id);
  }

  let created = 0;
  let skipped = 0;

  for (const m of matches) {
    const rivalId = rivalIdByName.get(m.opponent);
    if (!rivalId) {
      console.error(`No encontrado rival para: ${m.opponent}`);
      continue;
    }

    const date = toMatchDate(m.date);

    const existing = await prisma.match.findFirst({ where: { rivalId, date } });
    if (existing) {
      console.log(`Ya existía partido jornada ${m.jornada} vs ${m.opponent} (${m.date})`);
      skipped++;
      continue;
    }

    await prisma.match.create({
      data: {
        rivalId,
        date,
        isHome: m.isHome,
        competition: "LIGA",
        status: "PROGRAMADO",
      },
    });
    console.log(
      `Creado partido jornada ${m.jornada}: ${m.isHome ? "vs" : "@"} ${m.opponent} (${m.date})`
    );
    created++;
  }

  console.log(`\nTotal: ${created} partidos creados, ${skipped} ya existían.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
