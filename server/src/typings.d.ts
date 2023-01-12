import fastify from "fastify";
import { User } from "model/user";

declare module "fastify" {
	interface FastifyInstance {
		config: {
			port: number;
			host: string;
		};
		user?: User;
	}
}
