import fastify from "fastify";
import { User } from "model/user";
import { AuthService } from "model/model";

declare module "fastify" {
	interface FastifyInstance {
		config: {
			port: number;
			host: string;
		};
	}

	interface FastifyRequest {
		user: User;
	}
}
