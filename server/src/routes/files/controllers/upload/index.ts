import { CreateUploadController, UploadController } from "./model";
import { createRandomString } from "./utils";
import path from "path";
import Exception from "common/errors";

const createUploadController: CreateUploadController = ({
	fileStorage,
	fileBucket,
	slugStorage,
	shortnerFunctionUrl,
}) => {
	const uploadRequest: UploadController["uploadRequest"] = async (input) => {
		// TODO (future) check size valid for user
		const filename = createRandomString();

		// TODO (future) change path type
		const uploadUrl = await fileStorage.getPresignUploadUrl(
			fileBucket,
			`${filename}${path.extname(input.filename)}`,
			60 * 10 // 10 minutes
		);

		const downloadUrl = await fileStorage.getPresignDownloadUrl(
			fileBucket,
			`${filename}${path.extname(input.filename)}`,
			60 * 10 // 10 minutes
		);

		const slug = await slugStorage.createSlug(
			downloadUrl,
			60 * 10 // 10 minutes
		);

		return {
			slug,
			url: uploadUrl,
		};
	};

	const ackRequest: UploadController["ackRequest"] = async (input) => {
		const downloadUrl = await slugStorage.getValue(input.slug);

		if (!downloadUrl) {
			throw new Exception("NOT_FOUND", "file not exist");
		}

		// TODO (future) calculate expiration depens on user
		const expireAt = new Date();
		expireAt.setHours(new Date().getHours() + 1);

		await slugStorage.setExpiration(
			input.slug,
			(expireAt.getHours() - 1) * 60 * 60
		);

		return {
			url: `${shortnerFunctionUrl}/${input.slug}`,
			expireAt: expireAt,
		};
	};

	return {
		uploadRequest,
		ackRequest,
	};
};

export default createUploadController;
