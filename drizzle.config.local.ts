import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. For XAMPP, use: mysql://root:@localhost:3306/formcraft_pro");
}

export default defineConfig({
  out: "./migrations",
  schema: "./server/mysql-schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});