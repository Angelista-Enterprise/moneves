import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL || "./sqlite.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
