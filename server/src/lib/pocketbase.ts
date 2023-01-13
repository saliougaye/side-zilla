import { User } from "model/user";
import Pocketbase from "pocketbase";
import {
	Collections,
	AuthSystemFields,
	UsersResponse,
	PlanResponse,
	UsersPlanResponse,
	UsersPlanRecord,
} from "generated/pocketbase-types";
import { PlanConfiguration } from "model/plan";
import { AuthService } from "model/model";

export interface PocketbaseConfig {
	url: string;
}

export type PocketbaseServiceBuilder = (
	config: PocketbaseConfig
) => AuthService;

type UserPlan = UsersResponse & {
	expand:
		| {}
		| {
				"users_plan(user_id)": {
					expand: {
						plan_id: PlanResponse<PlanConfiguration>;
					};
				};
		  };
};

const createPocketBaseService: PocketbaseServiceBuilder = (config) => {
	const pb = new Pocketbase(config.url);

	const getUserByToken: AuthService["getUserByToken"] = async (token) => {
		try {
			// save token
			await pb.authStore.save(token, null);

			// check if is valid
			const tokenUser = await pb.collection(Collections.Users).authRefresh();

			// fetch user
			const user = await pb
				.collection(Collections.Users)
				.getOne<UserPlan>(tokenUser.record.id, {
					expand: "users_plan(user_id).plan_id",
				});

			if (Object.keys(user.expand).length === 0) {
				const freePlan = await pb
					.collection(Collections.Plan)
					.getFirstListItem<PlanResponse<PlanConfiguration>>("name='free'");

				const planUser: UsersPlanRecord = {
					user_id: user.id,
					plan_id: freePlan.id,
				};
				await pb.collection(Collections.UsersPlan).create(planUser);

				return {
					id: user.id,
					name: user.name,
					username: user.username,
					plan: {
						id: freePlan.id,
						name: freePlan.name,
						configuration: freePlan.configuration,
					},
				};
			}

			return {
				id: user.id,
				name: user.name,
				username: user.username,
				plan: {
					id: user.expand["users_plan(user_id)"].expand.plan_id.id,
					name: user.expand["users_plan(user_id)"].expand.plan_id.name,
					configuration:
						user.expand["users_plan(user_id)"].expand.plan_id.configuration,
				},
			};
		} catch (error) {
			throw error;
		} finally {
			await pb.authStore.clear();
		}
	};

	return {
		getUserByToken,
	};
};

export default createPocketBaseService;
