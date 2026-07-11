import { Args, Command } from "@sapphire/framework";
import { ActionRowBuilder, ChannelType, ComponentType, StringSelectMenuBuilder, type GuildTextBasedChannel, type Message } from "discord.js";
import { db } from "../db";
import { settings } from "../db/schema";
import { owner } from "../utils/owner";
import { buttons, panel } from "../utils/verification";

const promptText = "choose a channel for the panel to send in (expires in 1 minute btw)";

export class VerificationCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, { ...options, name: "verification", description: "Creates the verification panel." });
	}

	public override async messageRun(message: Message, args: Args) {
		if (!message.guild) return;
		if (!owner(message)) return;

		const role = await args.pick("role").catch(() => null);
		if (!role) return message.reply(`Usage ${this.container.client.options.defaultPrefix}verification @role`);

		const channel = await pickPanelChannel(message);
		if (!channel) return;

		const msg = await channel.send({ embeds: [panel()], components: [buttons(message.guild.id)] });

		await db.insert(settings).values({
			guildID: message.guild.id,
			roleID: role.id,
			panelChannelID: channel.id,
			panelMessageID: msg.id,
		}).onConflictDoUpdate({
			target: settings.guildID,
			set: { roleID: role.id, panelChannelID: channel.id, panelMessageID: msg.id },
		});

		return message.reply(`verification panel sent to ${channel}`);
	}
}

async function pickPanelChannel(message: Message) {
	const channels = message.guild?.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).first(25) ?? [];
	if (!channels.length) {
		await message.reply("I couldn't find any text channels.");
		return null;
	}

	const prompt = await message.reply({ content: promptText, components: [channelMenu(message.id, channels)] });
	const selected = await prompt.awaitMessageComponent({
		componentType: ComponentType.StringSelect,
		time: 60_000,
		filter: (interaction) => interaction.user.id === message.author.id,
	}).catch(() => null);

	if (!selected) {
		await prompt.edit({ content: "channel picker expired", components: [] });
		return null;
	}

	const channel = message.guild?.channels.cache.get(selected.values[0] ?? "");
	if (!channel || channel.type !== ChannelType.GuildText) {
		await selected.update({ content: "that channel is invalid now", components: [] });
		return null;
	}

	await selected.update({ content: `selected ${channel}`, components: [] });
	return channel;
}

function channelMenu(id: string, channels: GuildTextBasedChannel[]) {
	return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
		new StringSelectMenuBuilder()
			.setCustomId(`verification-channel-${id}`)
			.setPlaceholder("choose a channel")
			.addOptions(channels.map((channel) => ({ label: channel.name, value: channel.id }))),
	);
}
