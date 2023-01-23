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
		const filename = createRandomString();

		// TODO (future) change path type
		const uploadUrl = await fileStorage.getPresignUploadUrl(
			fileBucket,
			`${filename}${path.extname(input.filename)}`,
			60 * 10 // 10 minutes
		);
		const ext = path.extname(input.filename);
		const downloadUrl = await fileStorage.getPresignDownloadUrl(
			fileBucket,
			`${filename}${ext}`,
			60 * 10 // 10 minutes
		);

		const slug = await slugStorage.createSlug({
			url: downloadUrl,
			ext,
			expiresAt: 60 * 10, // 10 minutes
		});

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

		const expireAt = new Date();
		expireAt.setHours(new Date().getHours() + 1);

		await slugStorage.setExpiration(input.slug, input.expiration * 60 * 60);

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
