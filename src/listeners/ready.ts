import { Events, Listener } from "@sapphire/framework";
import { logger } from "../utils/logger";

export class ReadyListener extends Listener {
	public constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, { ...options, once: true, event: Events.ClientReady });
	}

	public run() {
		logger.discord.log(`Logged in as ${this.container.client.user?.tag}`);
	}
}
