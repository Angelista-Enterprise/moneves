import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Create database client based on environment
const createDatabaseClient = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    // Production: Use Turso (libSQL)
    return createClient({
      url: databaseUrl,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  } else {
    // Development: Use local SQLite with libSQL
    return createClient({
      url: "file:sqlite.db",
    });
  }
};

const client = createDatabaseClient();
export const db = drizzle(client, { schema });

export * from "./schema";
