import { SlugInput, SlugOutput } from "./model";
import { slugRepository } from "./repository";

const createRedisService = () => {
	const createSlug = async (input: SlugInput): Promise<string> => {
		const entity = slugRepository.createEntity();
		entity.url = input.url;
		entity.ext = input.ext;

		const slug = await slugRepository.save(entity);
		await setExpiration(slug, input.expiresAt);

		return slug;
	};

	const getValue = async (slug: string): Promise<SlugOutput | undefined> => {
		const entity = await slugRepository.fetch(slug);

		if (!entity) {
			return undefined;
		}

		return entity;
	};

	const setExpiration = async (slug: string, expiresAt: number) => {
		await slugRepository.expire(slug, expiresAt);
	};

	return {
		createSlug,
		getValue,
		setExpiration,
	};
};

export default createRedisService;
