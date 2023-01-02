import { SlugInput, SlugOutput } from "lib/redis/model";

export type CreateUploadController = (deps: {
	fileStorage: FileStorage;
	slugStorage: SlugStorage;
	fileBucket: string;
	shortnerFunctionUrl: string;
}) => UploadController;

export interface UploadController {
	uploadRequest: (input: UploadInput) => Promise<UploadOutput>;
	ackRequest: (input: AckInput) => Promise<AckOutput>;
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
