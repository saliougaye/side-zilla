import { ZodError } from "zod";

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

	return {
		statusCode: 500,
		body: {
			message: "Something went wrong",
			error: error,
		},
	};
};
