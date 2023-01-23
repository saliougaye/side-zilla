import { Plan } from "./plan";

export type User = {
	id: string;
	name?: string;
	username: string;
	plan: Plan;
};
