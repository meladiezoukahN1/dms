import "dotenv/config";
import { defineConfig } from "prisma/config";

const prismaDatasourceUrl =
  process.env.DATABASE_URL ?? "mysql://root:root@127.0.0.1:3306/dms";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Allows `prisma generate` to run in CI install steps before env injection.
    url: prismaDatasourceUrl,
  },
});