import { Entity, Schema } from "redis-om";
import client from "./client";

interface Slug {
	filename: string;
	ext: string;
}

class Slug extends Entity {}

const SlugSchema = new Schema(Slug, {
	filename: {
		type: "string",
	},
	ext: {
		type: "string",
	},
});

export const slugRepository = client.fetchRepository(SlugSchema);

await slugRepository.createIndex();
