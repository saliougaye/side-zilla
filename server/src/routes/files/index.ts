import config from "config";
import { FastifyInstance } from "fastify";
import createMinioService from "lib/minio";
import createUploadController from "./controllers/upload";
import createUploadHandler from "./handlers/upload";

const fileRoute = async (fastify: FastifyInstance) => {
	const handler = createUploadHandler({
		controller: createUploadController({
			fileBucket: config.minio.fileBucket,
			storage: createMinioService(
				config.minio.endpoint,
				config.minio.user,
				config.minio.password,
				config.minio.port,
				false
			),
		}),
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
