import { init, start } from "./server";
import config from "./config";
import routes from "./routes/index";

(async () => {
	const server = init({
		host: config.host,
		port: config.port,
	});

	server.register;
	server.register(routes);

	start(server);
})();
