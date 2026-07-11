import { defineConfig } from "drizzle-kit";

if (!process.env.URL) {
	throw new Error("Missing database URL. Set URL in .env.");
}

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.URL,
	},
});
