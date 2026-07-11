CREATE TABLE "settings" (
	"guildID" text PRIMARY KEY NOT NULL,
	"roleID" text NOT NULL,
	"panelchannelID" text,
	"panelmsgID" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"userID" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"secret" text NOT NULL
);
