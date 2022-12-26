import { UploadController, UploadInput, UploadOutput } from "./model";
import { createSlug } from "./utils";

const createUploadController = (): UploadController => {
	const uploadRequest = async (input: UploadInput): Promise<UploadOutput> => {
		// TODO (future) check size valid for user
		// TODO create a presign url with expiration
		// TODO presign url information

		return {
			slug: createSlug(),
			url: "",
			expire: "",
		};
	};

	return {
		uploadRequest,
	};
};

export default createUploadController;
