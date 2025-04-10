import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from .env file at project root
dotenv.config({ path: resolve(__dirname, ".env") });

// Make sure DATABASE_URL exists in environment
const databaseUrl = process.env.DATABASE_URL ?? "";

export default defineConfig({
  dialect: "postgresql",
  schema: "./app/db/schema", // Path to schema files in app/db/schema directory
  out: "./app/db/migrations", // Output migrations to app/db/migrations
  dbCredentials: {
    // Use direct URL format
    url: databaseUrl,
  },
  verbose: true, // Provides more detailed logs during migration generation
  strict: true, // Enable strict mode for better type safety
});
