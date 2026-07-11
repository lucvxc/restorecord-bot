import type { Message } from "discord.js";

export const owner = (message: Message) => message.author.id === process.env.OWNER;
