import { SapphireClient } from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";
import { start } from "./server/index";
import { logger } from "./utils/logger";

const token = process.env.TOKEN;
const prefix = process.env.PREFIX ?? "$";

if (!token) {
	logger.app.error("missing TOKEN in .env");
	process.exit(1);
}

const client = new SapphireClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
	loadMessageCommandListeners: true,
	defaultPrefix: prefix,
});

logger.app.log(`prefix --> ${prefix}`);
await client.login(token);
start();
