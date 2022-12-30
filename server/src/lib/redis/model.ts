import { Entity, Schema } from "redis-om";
import client from "./client";

class Slug extends Entity {}

const SlugSchema = new Schema(Slug, {
	url: {
		type: "string",
	},
});

export const slugRepository = client.fetchRepository(SlugSchema);

await slugRepository.createIndex();
