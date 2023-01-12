import type {
	FastifyInstance,
	FastifyRegister,
	preHandlerHookHandler,
} from "fastify";

export interface AuthorizationHookConfig {
	instance: FastifyInstance;
	authService: {
		getUserByToken: (token: string) => Promise<unknown | undefined>;
	};
}

const authorizationHook = (config: AuthorizationHookConfig) => {
	config.instance.addHook("preHandler", async (req, reply, done) => {
		const authToken = req.headers.authorization;

		if (!authToken) {
			return reply.code(401).send({
				message: "invalid token",
			});
		}

		const user = await config.authService.getUserByToken(authToken);

		if (!user) {
			return reply.code(401).send({
				message: "invalid token",
			});
		}

		config.instance.decorate("user", user);

		done();
	});
};

export default authorizationHook;
