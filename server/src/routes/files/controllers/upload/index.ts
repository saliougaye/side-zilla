import { CreateUploadController, UploadInput, UploadOutput } from "./model";
import { createRandomString } from "./utils";
import path from "path";

const createUploadController: CreateUploadController = ({
	fileStorage,
	fileBucket,
	slugStorage,
}) => {
	const uploadRequest = async (input: UploadInput): Promise<UploadOutput> => {
		// TODO (future) check size valid for user
		const filename = createRandomString();

		// TODO (future) calculate expiration depens on user
		const expireAt = new Date();
		expireAt.setHours(new Date().getHours() + 1);

		// TODO (future) change path type
		const url = await fileStorage.getPresignUrl(
			fileBucket,
			`${filename}${path.extname(input.filename)}`,
			(expireAt.getHours() - 1) * 60 * 60
		);

		const slug = await slugStorage.createSlug(
			url,
			(expireAt.getHours() - 1) * 60 * 60
		);

		return {
			slug,
			url,
			expireAt,
		};
	};

	return {
		uploadRequest,
	};
};

export default createUploadController;
