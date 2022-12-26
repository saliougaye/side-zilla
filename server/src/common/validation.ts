import { FastifyRequest } from "fastify";
import { AnyZodObject } from "zod";
import { z } from "zod";

export const validateRequestSchema = async <T extends AnyZodObject>(
	req: FastifyRequest,
	schema: T
): Promise<z.infer<T>> => {
	const parsed = await schema.parseAsync(req);

	return parsed as T;
};
