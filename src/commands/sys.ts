import { Args, Command } from "@sapphire/framework";
import { eq } from "drizzle-orm";
import type { Message } from "discord.js";
import { db } from "../db";
import { settings } from "../db/schema";
import { owner } from "../utils/owner";

export class SysCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, { ...options, name: "sys", description: "pretty much js resets your settings." });
	}

	public override async messageRun(message: Message, args: Args) {
		if (!message.guild) return;
		if (!owner(message)) return;

		const sub = await args.pick("string").catch(() => null);
		if (sub !== "reset") return message.reply(`Usage ${this.container.client.options.defaultPrefix}sys reset`);

		await db.delete(settings).where(eq(settings.guildID, message.guild.id));
		return message.reply("settings reset");
	}
}
