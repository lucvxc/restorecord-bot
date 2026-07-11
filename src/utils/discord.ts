type Token = { access_token: string; refresh_token: string };
export type User = { id: string; username: string; global_name?: string | null };

const api = "https://discord.com/api";

function form(extra: Record<string, string>) {
	const { CLIENTID: clientID, CLIENTSECRET: clientSecret } = process.env;
	if (!clientID || !clientSecret) throw new Error("missing CLIENTID or CLIENTSECRET in .env");

	return new URLSearchParams({ client_id: clientID, client_secret: clientSecret, ...extra });
}

async function token(body: URLSearchParams) {
	const res = await fetch(`${api}/oauth2/token`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body,
	});

	return res.ok ? await res.json() as Token : null;
}

export const auth = (code: string) => {
	const redirectURI = process.env.REDIRECTURI;
	if (!redirectURI) throw new Error("missing REDIRECTURI in .env");

	return token(form({ grant_type: "authorization_code", code, redirect_uri: redirectURI }));
};

export const refresh = (secret: string) =>
	token(form({ grant_type: "refresh_token", refresh_token: secret }));

export async function me(accessToken: string) {
	const res = await fetch(`${api}/users/@me`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	return res.ok ? await res.json() as User : null;
}

export async function has(guildID: string, userID: string) {
	const res = await fetch(`${api}/guilds/${guildID}/members/${userID}`, {
		headers: { Authorization: `Bot ${process.env.TOKEN}` },
	});

	return res.ok;
}

export function join(guildID: string, userID: string, accessToken: string, roleID?: string) {
	return fetch(`${api}/guilds/${guildID}/members/${userID}`, {
		method: "PUT",
		headers: { Authorization: `Bot ${process.env.TOKEN}`, "Content-Type": "application/json" },
		body: JSON.stringify({ access_token: accessToken, roles: roleID ? [roleID] : undefined }),
	});
}

export const role = (guildID: string, userID: string, roleID: string) =>
	fetch(`${api}/guilds/${guildID}/members/${userID}/roles/${roleID}`, {
		method: "PUT",
		headers: { Authorization: `Bot ${process.env.TOKEN}` },
	});

export const ok = (res: Response) => res.ok || res.status === 204;
