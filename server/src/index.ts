import { init, start } from "./server";
import config from "./config";
import routes from "./routes/index";
import dotenv from "dotenv";

(async () => {
	console.log(__dirname);

	dotenv.config();
	const server = init({
		host: config.host,
		port: config.port,
	});

	server.register(routes);

	start(server);
})();
