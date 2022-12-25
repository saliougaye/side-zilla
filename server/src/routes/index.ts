import { FastifyInstance } from "fastify";
import helloRoute from "./hello";

export default async (fastify: FastifyInstance) => {
	fastify.register(helloRoute);
};
