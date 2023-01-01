import { z } from "zod";

export const UploadRequestSchema = z.object({
	body: z.object(
		{
			size: z
				.number({
					required_error: "size property is required",
					invalid_type_error: "size must be a number",
				})
				.positive({
					message: "size must be a positive number",
				}),
			filename: z
				.string({
					required_error: "filename property is required",
					invalid_type_error: "filename must be a string",
				})
				.regex(/^[\w,\s-]+\.[A-Za-z]{2,4}$/gm, {
					message: "filename must containe extension",
				}),
		},
		{
			required_error: "require body",
			invalid_type_error: "require valid body request",
		}
	),
});

export const AckRequestSchema = z.object({
	body: z.object({
		slug: z
			.string({
				required_error: "slug property is required",
				invalid_type_error: "slug must be a string",
			})
			.min(1),
	}),
});