import { init, start } from "./server";
import config from "./config";
import routes from "./routes/index";
import authPlugin from "hooks/auth.middleware";
import createPocketBaseService from "lib/pocketbase";

(async () => {
	const server = init({
		host: config.host,
		port: config.port,
	});

	server.register(authPlugin, {
		authService: createPocketBaseService({
			url: process.env.POCKETBASE_URL,
		}),
	});
	server.register(routes);

	start(server);
})();
