import { slugRepository } from "./repository";
import { SlugStorage } from "model/model";

export type RedisServiceBuilder = () => SlugStorage;

const createRedisService: RedisServiceBuilder = () => {
	const createSlug: SlugStorage["createSlug"] = async (input) => {
		const entity = slugRepository.createEntity();
		entity.filename = input.filename;
		entity.ext = input.ext;

		const slug = await slugRepository.save(entity);
		await setExpiration(slug, input.expiresAt);

		return slug;
	};

	const getValue: SlugStorage["getValue"] = async (slug) => {
		const entity = await slugRepository.fetch(slug);

		if (!entity) {
			return undefined;
		}

		return entity;
	};

	const setExpiration: SlugStorage["setExpiration"] = async (
		slug,
		expiresAt
	) => {
		await slugRepository.expire(slug, expiresAt);
	};

	return {
		createSlug,
		getValue,
		setExpiration,
	};
};

export default createRedisService;
