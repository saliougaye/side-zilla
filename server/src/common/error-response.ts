import { ZodError } from "zod";
import Exception from "./errors";

interface ErrorResponse {
	statusCode: number;
	body: {
		message: string;
		error?: unknown;
	};
}

export const createErrorResponse = (error: unknown): ErrorResponse => {
	if (error instanceof ZodError) {
		return {
			statusCode: 400,
			body: {
				message: error.issues[0].message,
			},
		};
	}

	if (error instanceof Exception) {
		return {
			statusCode: error.getStatusCode,
			body: {
				message: error.getMessage,
			},
		};
	}

	return {
		statusCode: 500,
		body: {
			message: "Something went wrong",
			error: error,
		},
	};
};
