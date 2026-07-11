import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db";
import { settings, users } from "../db/schema";
import { auth, join, me, ok, role } from "../utils/discord";
import { logger } from "../utils/logger";

export const routes = new Hono();

routes.get("/oauth/callback", async (context) => {
	const code = context.req.query("code");
	const guildID = context.req.query("state");

	if (!code || !guildID) return context.text("missing oauth code or state", 400);

	const [token, config] = await Promise.all([
		auth(code),
		db.select().from(settings).where(eq(settings.guildID, guildID)).limit(1).then(([row]) => row),
	]);
	if (!token) return context.text("oauth token exchange failed", 400);
	if (!config) return context.text("verification is not setup for this server", 404);

	const user = await me(token.access_token);
	if (!user) return context.text("failed to fetch discord user", 400);

	await db.insert(users).values({
		userID: user.id,
		username: user.global_name ?? user.username,
		secret: token.refresh_token,
	}).onConflictDoUpdate({
		target: users.userID,
		set: { username: user.global_name ?? user.username, secret: token.refresh_token },
	});

	if (!ok(await join(guildID, user.id, token.access_token))) return context.text("failed to join server", 400);
	if (!ok(await role(guildID, user.id, config.roleID))) return context.text("verified, but failed to add role", 400);

	logger.db.log(`verified ${user.username} in ${guildID}`);
	return context.text("verified, you can return to discord");
});
