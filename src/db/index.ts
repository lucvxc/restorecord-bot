import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const dburl = process.env.URL;

if (!dburl) {
	throw new Error("Missing database URL. Set URL in .env.");
}

export const sql = postgres(dburl);
export const db = drizzle(sql, { schema });
export { schema };
