import { FastifyInstance } from "fastify";
import createUploadController from "./controllers/upload";
import createUploadHandler from "./handlers/upload";

const fileRoute = async (fastify: FastifyInstance) => {
	const handler = createUploadHandler({
		controller: createUploadController(),
	});

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
