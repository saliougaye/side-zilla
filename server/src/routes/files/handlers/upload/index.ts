import { createErrorResponse } from "common/error-response";
import { validateRequestSchema } from "common/validation";
import { RouteHandlerMethod } from "fastify";
import { CreateUploadHandlerDeps } from "./model";
import { AckRequestSchema, UploadRequestSchema } from "./schema";

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
				expiration: result.expireAt,
			});
		} catch (error) {
			const { statusCode, body } = createErrorResponse(error);

			reply.code(statusCode).send(body);
		}
	};

	const ack: RouteHandlerMethod = async (req, reply) => {
		try {
			const { body } = await validateRequestSchema(req, AckRequestSchema);

			const result = await controller.ackRequest({
				slug: body.slug,
			});

			reply.code(result.ack ? 204 : 404).send();
		} catch (error) {
			const { statusCode, body } = createErrorResponse(error);

			reply.code(statusCode).send(body);
		}
	};

	return {
		upload,
		ack,
	};
};

export default createUploadHandler;
