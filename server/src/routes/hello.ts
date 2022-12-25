import { FastifyInstance } from "fastify";

const helloRoute = async (fastify: FastifyInstance) => {
	fastify.route({
		method: "GET",
		url: "/hello",
		handler: (request, reply) => {
			reply.code(200).send({
				message: "hello world",
			});
		},
	});
};

export default helloRoute;
