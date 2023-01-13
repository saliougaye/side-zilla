import { User } from "./user";

export interface AuthService {
	getUserByToken: (token: string) => Promise<User | undefined>;
}
