import { slugRepository } from "./model";

const createRedisService = () => {
	const createSlug = async (url: string, expiresAt: number) => {
		const entity = slugRepository.createEntity({
			url,
		});
		const slug = await slugRepository.save(entity);
		await setExpiration(slug, expiresAt);

		return slug;
	};

	const getValue = async (slug: string): Promise<string | undefined> => {
		const entity = await slugRepository.fetch(slug);

		if (!entity.url) {
			return undefined;
		}

		return entity.url;
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
