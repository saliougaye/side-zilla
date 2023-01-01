import { FastifyInstance } from "fastify";
import fileRoute from "./files";

export default async (fastify: FastifyInstance) => {
	fastify.register(fileRoute, { prefix: "/v1/file" });
};
