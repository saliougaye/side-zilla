export type CreateUploadController = (deps: {
	fileStorage: FileStorage;
	fileBucket: string;
	slugStorage: SlugStorage;
}) => UploadController;

export interface UploadController {
	uploadRequest: (input: UploadInput) => Promise<UploadOutput>;
	ackRequest: (input: AckInput) => Promise<AckOutput>;
}

export interface FileStorage {
	getPresignUrl: (
		bucket: string,
		objectPath: string,
		expiration: number
	) => Promise<string>;
}

export interface SlugStorage {
	createSlug: (url: string, expireAt: number) => Promise<string>;
	slugExist: (slug: string) => Promise<boolean>;
}

export interface UploadInput {
	size: number;
	filename: string;
}

export interface UploadOutput {
	slug: string;
	url: string;
	expireAt: Date;
}

export interface AckInput {
	slug: string;
}

export interface AckOutput {
	ack: boolean;
}
