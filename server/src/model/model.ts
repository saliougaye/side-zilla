import { User } from "./user";

export interface AuthService {
	getUserByToken: (token: string) => Promise<User | undefined>;
}

export interface FileStorage {
	getPresignUploadUrl: (
		bucket: string,
		objectPath: string,
		expiration: number
	) => Promise<string>;
	getPresignDownloadUrl: (
		bucket: string,
		objectPath: string,
		expiration: number
	) => Promise<string>;
}

export interface SlugStorage {
	createSlug: (input: SlugInput) => Promise<string>;
	getValue: (slug: string) => Promise<SlugOutput | undefined>;
	setExpiration: (slug: string, expireAt: number) => Promise<void>;
}
export interface SlugInput {
	url: string;
	ext: string;
	expiresAt: number;
}

export interface SlugOutput {
	url: string;
	ext: string;
}

export interface UploadInput {
	size: number;
	filename: string;
}

export interface UploadOutput {
	slug: string;
	url: string;
}

export interface AckInput {
	slug: string;
}

export interface AckOutput {
	url: string;
	expireAt: Date;
}
