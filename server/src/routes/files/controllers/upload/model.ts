export type CreateUploadController = (deps: {
	storage: {
		getPresignUrl: (
			bucket: string,
			objectPath: string,
			expiration: number
		) => Promise<string>;
	};
	fileBucket: string;
}) => UploadController;

export interface UploadController {
	uploadRequest: (input: UploadInput) => Promise<UploadOutput>;
}

export interface UploadInput {
	size: number;
	filename: string;
}

export interface UploadOutput {
	slug: string;
	url: string;
	expire: number;
}
