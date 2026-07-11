export function buildURL(guildID: string) {
	const clientID = process.env.CLIENTID;
	const redirectURI = process.env.REDIRECTURI;

	if (!clientID || !redirectURI) {
		throw new Error("Missing CLIENTID or REDIRECTURI in .env.");
	}

	const params = new URLSearchParams({
		client_id: clientID,
		redirect_uri: redirectURI,
		response_type: "code",
		scope: "identify guilds.join",
		state: guildID,
	});

	return `https://discord.com/oauth2/authorize?${params}`;
}
