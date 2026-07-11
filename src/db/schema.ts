import { pgTable, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	userID: text("userID").primaryKey(),
	username: text("username").notNull(),
	secret: text("secret").notNull(),
});

export const settings = pgTable("settings", {
	guildID: text("guildID").primaryKey(),
	roleID: text("roleID").notNull(),
	panelChannelID: text("panelchannelID"),
	panelMessageID: text("panelmsgID"),
});
