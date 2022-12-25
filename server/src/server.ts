import Fastify, { FastifyInstance } from "fastify";
import shutdown from "./shutdown";

interface InitConfiguration {
	port: number;
	host: string;
}

export const init = (config: InitConfiguration) => {
	const server = Fastify({});

	server.decorate("config", {
		port: config.port,
		host: config.host,
	});

	shutdown(server);
	return server;
};

export const start = (server: FastifyInstance) =>
	server.listen(
		{ port: server.config.port, host: server.config.host },
		(err, address) => {
			if (err) {
				console.log(err);

				process.exit(1);
				return;
			}

			console.log("Server started at ", address);
		}
	);
