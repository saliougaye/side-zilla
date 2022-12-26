import { createErrorResponse } from "common/error-response";
import { validateRequestSchema } from "common/validation";
import { RouteHandlerMethod } from "fastify";
import { CreateUploadHandlerDeps } from "./model";
import { UploadRequestSchema } from "./schema";

const createUploadHandler = ({ controller }: CreateUploadHandlerDeps) => {
	const upload: RouteHandlerMethod = async (req, reply) => {
		try {
			const { body } = await validateRequestSchema(req, UploadRequestSchema);

			const result = await controller.uploadRequest({
				filename: body.filename,
				size: body.size,
			});

			reply.code(200).send({
				id: result.slug,
				uploadUrl: result.url,
				expiration: result.expire,
			});
		} catch (error) {
			console.log(error);
			const { statusCode, body } = createErrorResponse(error);

			reply.code(statusCode).send(body);
		}
	};

	const ack: RouteHandlerMethod = (req, reply) => {
		reply.code(200).send({
			url: "",
		});
	};

	return {
		upload,
		ack,
	};
};

export default createUploadHandler;
