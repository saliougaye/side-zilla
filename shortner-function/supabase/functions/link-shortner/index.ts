import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Redis from "https://esm.sh/redis@4.5.1";

console.log("Link shortner function started");

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
	};

	await redis.disconnect();

	if (!e) {
		return new Response(null, {
			status: 404,
		});
	}

	const response = await fetch(e.url);

	return response;
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
// supabase functions serve send-message --env-file ./supabase/.env
