/**
 * Prisma seed script — creates initial ACTIVE test users.
 * Run with: npx tsx prisma/seed.ts
 *           or:  npx prisma db seed
 */

import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  // --- Admin user ---
  const adminHash = await hash("Admin@123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@dms.local" },
    update: {
      fullName: "مدير النظام",
      status: "ACTIVE",
      accountType: "admin",
    },
    create: {
      email: "admin@dms.local",
      fullName: "مدير النظام",
      passwordHash: adminHash,
      accountType: "admin",
      status: "ACTIVE",
    },
  });

  // --- Staff user ---
  const staffHash = await hash("Staff@123456", 12);
  const staff = await prisma.user.upsert({
    where: { email: "staff@dms.local" },
    update: {
      fullName: "موظف النظام",
      status: "ACTIVE",
      accountType: "staff",
    },
    create: {
      email: "staff@dms.local",
      fullName: "موظف النظام",
      passwordHash: staffHash,
      accountType: "staff",
      status: "ACTIVE",
    },
  });

  console.log("✅ Seed complete:");
  console.log("  admin@dms.local  / Admin@123456  —", admin.id);
  console.log("  staff@dms.local  / Staff@123456  —", staff.id);
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
