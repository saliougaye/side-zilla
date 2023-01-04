import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Redis from "https://esm.sh/redis@4.5.1";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

console.log("Link shortner function started");

if (Deno.env.get("ENVIRONMENT") !== "prod") {
	const env = config({
		path: "../../.env",
	});
	Deno.env.set("REDIS_URL", env["REDIS_URL"]);
}

const pattern = new URLPattern({ pathname: "/:slug" });
const redis = await Redis.createClient({
	url: Deno.env.get("REDIS_URL") || "",
});

serve(async (req) => {
	const matchingPath = pattern.exec(req.url);
	const slug = matchingPath ? matchingPath.pathname.groups.slug : null;

	if (!slug) {
		return new Response(null, {
			status: 400,
		});
	}

	await redis.connect();

	const e = (await redis.json.get(`Slug:${slug}`)) as {
		url: string;
		ext: string;
	};

	await redis.disconnect();

	if (!e) {
		return new Response(null, {
			status: 404,
		});
	}

	const response = await fetch(e.url);

	return new Response(response.body, {
		headers: {
			"Content-Type":
				response.headers.get("content-type") ?? "binary/octet-stream",
			"Content-Length": response.headers.get("content-length") ?? "0",
			"Content-Disposition": `attachment; filename="${slug}${e.ext}"`,
		},
	});
});

const startServer = (redis: Redis.RedisClientType) => {
	return serve(async (req) => {
		const matchingPath = pattern.exec(req.url);
		const slug = matchingPath ? matchingPath.pathname.groups.slug : null;

		if (!slug) {
			return new Response(null, {
				status: 400,
			});
		}

		await redis.connect();

		const e = (await redis.json.get(`Slug:${slug}`)) as {
			url: string;
			ext: string;
		};

		await redis.disconnect();

		if (!e) {
			return new Response(null, {
				status: 404,
			});
		}

		const response = await fetch(e.url);

		return new Response(response.body, {
			headers: {
				"Content-Type":
					response.headers.get("content-type") ?? "binary/octet-stream",
				"Content-Length": response.headers.get("content-length") ?? "0",
				"Content-Disposition": `attachment; filename="${slug}${e.ext}"`,
			},
		});
	});
};
