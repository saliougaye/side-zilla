import { CreateUploadController, UploadInput, UploadOutput } from "./model";
import { createSlug } from "./utils";

const createUploadController: CreateUploadController = ({
	storage,
	fileBucket,
}) => {
	const uploadRequest = async (input: UploadInput): Promise<UploadOutput> => {
		// TODO (future) check size valid for user

		// TODO create a presign url with expiration
		const slug = createSlug();
		// TODO (future) calculate expiration depens on user
		const expire = 60 * 60;

		// FIXME change path type
		const url = await storage.getPresignUrl(
			fileBucket,
			`${slug}_${input.filename}`,
			expire
		);

		return {
			slug: createSlug(),
			url,
			expire: expire,
		};
	};

	return {
		uploadRequest,
	};
};

export default createUploadController;
