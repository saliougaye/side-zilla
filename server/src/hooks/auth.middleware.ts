import { FastifyInstance } from "fastify";
import { AuthService } from "model/model";
import fp from "fastify-plugin";
export interface AuthorizationHookConfig {
	authService: AuthService;
}

const authPlugin = fp<AuthorizationHookConfig>(async (fastify, opts) => {
	fastify.decorateRequest("user", undefined);

	fastify.addHook("preHandler", async (req, reply) => {
		try {
			const authToken = req.headers.authorization;

			if (!authToken) {
				return reply.code(401).send({
					message: "invalid token",
				});
			}

			const user = await opts.authService.getUserByToken(authToken);

			if (!user) {
				return reply.code(401).send({
					message: "invalid token",
				});
			}

			req.user = user;
		} catch (error) {
			console.log(error);

			return reply.code(500).send({
				message: "something wrong happened",
			});
		}
	});
});

export default authPlugin;
