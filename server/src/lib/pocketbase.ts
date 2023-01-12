import { User } from "model/user";
import Pocketbase from "pocketbase";

export interface PocketbaseConfig {
	url: string;
}

const createPocketBaseService = (config: PocketbaseConfig) => {
	const pb = new Pocketbase(config.url);

	const getUserByToken = async (token: string): Promise<User | undefined> => {
		await pb.authStore.save(token, null);
	};

	return {
		getUserByToken,
	};
};

export default createPocketBaseService;
