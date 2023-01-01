import config from "config";
import { FastifyInstance } from "fastify";
import createMinioService from "lib/minio";
import createRedisService from "lib/redis";
import createUploadController from "./controllers/upload";
import createUploadHandler from "./handlers/upload";

const fileRoute = async (fastify: FastifyInstance) => {
	const handler = createUploadHandler({
		controller: createUploadController({
			fileBucket: config.minio.fileBucket,
			fileStorage: createMinioService(
				config.minio.endpoint,
				config.minio.user,
				config.minio.password,
				config.minio.port,
				false
			),
			slugStorage: createRedisService(),
			shortnerFunctionUrl: config.shortnerFunctionUrl,
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
