import { randomUUID } from "crypto";

export const createSlug = () => {
	return randomUUID();
};
