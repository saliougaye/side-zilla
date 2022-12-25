import { FastifyInstance } from "fastify";
import createUploadHandler from "./handlers/upload";

const fileRoute = async (fastify: FastifyInstance) => {
	const handler = createUploadHandler();

	fastify.route({
		method: "POST",
		url: "/upload",
		handler: handler.upload,
	});

	fastify.route({
		method: "POST",
		url: "/ack",
		handler: handler.ack,
	});
};

export default fileRoute;
