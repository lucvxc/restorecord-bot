import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { buildURL } from "./oauth";

export const embed1 = {
	description: "Click the button **Verify** Below to gain access to rest of the server",
	color: 0xffffff,
	thumbnail: {
		url: "https://i.pinimg.com/736x/bd/18/c0/bd18c0adb039101c248a2f8560d94bd0.jpg",
	},
};

export const embed2 = {
	title: "Why Verify Your Account?",
	description: "Verifying your account helps us keep your access secure and makes it easier for us to reconnect with you if anything happens to the server.",
	color: 0xffffff,
	fields: [
		{
			name: "Account Recovery",
			value: "If our server is ever deleted, disabled, or unexpectedly removed, verified users can be automatically invited back to our new server.",
		},
		{
			name: "Faster Rejoins",
			value: "Verified members don't have to search for new invite links or wait for announcements elsewhere. We can quickly get you back into the community.",
		},
		{
			name: "Stay Connected",
			value: "Verification allows us to notify you about important server updates, migrations, and recovery information when necessary.",
		},
		{
			name: "Your Privacy",
			value: "Verification is only used to confirm ownership of your Discord account and help maintain access to our community. We do not gain access to your password.",
		},
	],
};

export const panel = () => new EmbedBuilder(embed1);

export const why = () => new EmbedBuilder(embed2);

export const buttons = (guildID: string) =>
	new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder().setLabel("Verify").setStyle(ButtonStyle.Link).setURL(buildURL(guildID)),
		new ButtonBuilder().setCustomId("verification-why").setLabel("Why?").setStyle(ButtonStyle.Secondary),
	);
