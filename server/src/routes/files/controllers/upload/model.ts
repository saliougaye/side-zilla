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
	expire: string;
}
