import { Hono } from "hono";
import { logger } from "../utils/logger";
import { routes } from "./routes";

export function start() {
	const app = new Hono();
	const port = Number(process.env.PORT);

	app.route("/", routes);

	Bun.serve({ port, fetch: app.fetch });
	logger.app.log(`web server --> http://localhost:${port}`);
}
