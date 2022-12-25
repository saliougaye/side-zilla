import fastify from "fastify";

declare module "fastify" {
	interface FastifyInstance {
		config: {
			port: number;
			host: string;
		};
	}
}
