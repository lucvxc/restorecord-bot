import { Command } from "@sapphire/framework";
import { eq } from "drizzle-orm";
import type { Message } from "discord.js";
import { db } from "../db";
import { settings, users } from "../db/schema";
import { join, ok, refresh } from "../utils/discord";
import { logger } from "../utils/logger";
import { owner } from "../utils/owner";

type PullStats = { pulled: number; skipped: number; failed: number };

export class PullCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, { ...options, name: "pull", description: "Pulls verified users back into this server." });
	}

	public override async messageRun(message: Message) {
		if (!message.guild) return;
		if (!owner(message)) return;

		const [config] = await db.select().from(settings).where(eq(settings.guildID, message.guild.id)).limit(1);
		if (!config) return message.reply("setup verification first");

		const savedUsers = await db.select().from(users);
		const status = await message.reply(`pulling users... 0/${savedUsers.length}`);
		const stats: PullStats = { pulled: 0, skipped: 0, failed: 0 };

		for (const user of savedUsers) {
			const member = await message.guild.members.fetch(user.userID).catch(() => null);
			if (member) {
				stats.skipped++;
				continue;
			}

			const token = await refresh(user.secret);
			if (!token) {
				stats.failed++;
				continue;
			}

			await db.update(users).set({ secret: token.refresh_token }).where(eq(users.userID, user.userID));
			if (ok(await join(message.guild.id, user.userID, token.access_token, config.roleID))) {
				stats.pulled++;
				logger.discord.log(`pulled ${user.username} into ${message.guild.name}`);
			} else {
				stats.failed++;
			}
		}

		return status.edit(`pull finished **(${stats.pulled})** pulled, **(${stats.skipped})** already in server, **(${stats.failed})** failed`);
	}
}
