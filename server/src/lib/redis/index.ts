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

	return {
		createSlug,
	};
};

export default createRedisService;
