import { Entity, Schema } from "redis-om";
import client from "./client";

interface Slug {
	url: string;
}

class Slug extends Entity {}

const SlugSchema = new Schema(Slug, {
	url: {
		type: "string",
	},
});

export const slugRepository = client.fetchRepository(SlugSchema);

await slugRepository.createIndex();
