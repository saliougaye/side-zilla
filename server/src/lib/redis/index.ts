import { slugRepository } from "./model";

const createRedisService = () => {
	const createSlug = async (url: string, expiresAt: number) => {
		const entity = slugRepository.createEntity({
			url,
		});
		const slug = await slugRepository.save(entity);
		await slugRepository.expire(slug, expiresAt);

		return slug;
	};

	const slugExist = async (slug: string) => {
		const entity = await slugRepository.fetch(slug);

		return entity.url != null;
	};

	return {
		createSlug,
		slugExist,
	};
};

export default createRedisService;
