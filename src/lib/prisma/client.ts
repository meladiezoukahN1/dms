// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import { PrismaClient } from "@prisma/client";

// function createPrismaAdapter() {
//   const databaseUrl =
//     process.env.DATABASE_URL?.trim() || "mysql://root:root@127.0.0.1:3306/dms";

//   return new PrismaMariaDb(databaseUrl);
// }

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// export const prisma =
//   globalForPrisma.prisma ||
//   new PrismaClient({
//     adapter: createPrismaAdapter(),
//     log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
//   });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaAdapter() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
  }

  return new PrismaMariaDb(databaseUrl);
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: createPrismaAdapter(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}