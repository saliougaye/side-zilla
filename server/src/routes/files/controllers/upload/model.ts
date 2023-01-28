import {
	AckInput,
	AckOutput,
	FileStorage,
	SlugStorage,
	UploadInput,
	UploadOutput,
} from "model/model";

export type CreateUploadController = (deps: {
	fileStorage: FileStorage;
	slugStorage: SlugStorage;
	fileBucket: string;
	tempFileBucket: string;
	shortnerFunctionUrl: string;
}) => UploadController;

export interface UploadController {
	uploadRequest: (input: UploadInput) => Promise<UploadOutput>;
	ackRequest: (input: AckInput) => Promise<AckOutput>;
}
