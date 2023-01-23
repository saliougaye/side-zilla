import { createErrorResponse } from "common/error-response";
import { validateRequestSchema } from "common/validation";
import { RouteHandlerMethod } from "fastify";
import { CreateUploadHandlerDeps } from "./model";
import { AckRequestSchema, UploadRequestSchema } from "./schema";

const createUploadHandler = ({ controller }: CreateUploadHandlerDeps) => {
	const upload: RouteHandlerMethod = async (req, reply) => {
		try {
			const { body, isSizeValid } = await UploadRequestSchema.parseAsync(req);

			const maxSize = req.user.plan.configuration.maxSize;

			if (!isSizeValid(maxSize)) {
				return reply.code(403).send({
					message: "file it's bigger than your max size possible. upgrade plan",
				});
			}

			const result = await controller.uploadRequest({
				filename: body.filename,
				size: body.size,
			});

			reply.code(200).send({
				id: result.slug,
				uploadUrl: result.url,
			});
		} catch (error) {
			console.log(error);
			const { statusCode, body } = createErrorResponse(error);

			reply.code(statusCode).send(body);
		}
	};

	const ack: RouteHandlerMethod = async (req, reply) => {
		try {
			const { body } = await validateRequestSchema(req, AckRequestSchema);

			const result = await controller.ackRequest({
				slug: body.slug,
				expiration: req.user.plan.configuration.uploadExpiration,
			});

			reply.code(200).send({
				url: result.url,
				expiresAt: result.expireAt,
			});
		} catch (error) {
			console.log(error);

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
