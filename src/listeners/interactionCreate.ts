import { Events, Listener } from "@sapphire/framework";
import type { Interaction } from "discord.js";
import { why } from "../utils/verification";

export class InteractionCreateListener extends Listener<typeof Events.InteractionCreate> {
	public constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, { ...options, event: Events.InteractionCreate });
	}

	public async run(interaction: Interaction) {
		if (!interaction.isButton() || interaction.customId !== "verification-why") return;

		return interaction.reply({
			flags: 64,
			embeds: [why()],
		});
	}
}
