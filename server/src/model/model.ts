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
	moveFile: (
		destinationBucket: string,
		objectPath: string,
		sourcePath: string,
		expireAt: Date
	) => Promise<void>;
}

export interface SlugStorage {
	createSlug: (input: SlugInput) => Promise<string>;
	getValue: (slug: string) => Promise<SlugOutput | undefined>;
	setExpiration: (slug: string, expireAt: number) => Promise<void>;
}
export interface SlugInput {
	filename: string;
	ext: string;
	expiresAt: number;
}

export interface SlugOutput {
	filename: string;
	ext: string;
}

export interface UploadInput {
	size: number;
	filename: string;
	userId: string;
}

export interface UploadOutput {
	slug: string;
	url: string;
}

export interface AckInput {
	userId: string;
	slug: string;
	expiration: number;
}

export interface AckOutput {
	url: string;
	expireAt: Date;
}
