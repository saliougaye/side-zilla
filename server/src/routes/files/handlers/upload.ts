import { RouteHandlerMethod } from "fastify";

const createUploadHandler = () => {
	const upload: RouteHandlerMethod = (req, reply) => {
		reply.code(200).send({
			id: "",
			uploadUrl: "",
			expiration: 1,
		});
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
