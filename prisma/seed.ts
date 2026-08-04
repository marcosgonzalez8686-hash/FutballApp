import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const users = [
    { name: "Admin", email: "admin@clubfutbol.local", password: "cambiame123" },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, passwordHash },
    });
    console.log(`Usuario listo: ${u.email} (contraseña inicial: ${u.password})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
