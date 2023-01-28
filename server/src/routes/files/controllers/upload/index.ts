import { CreateUploadController, UploadController } from "./model";
import { createRandomString } from "./utils";
import path from "path";
import Exception from "common/errors";
import dayjs from "dayjs";

const createUploadController: CreateUploadController = ({
	fileStorage,
	fileBucket,
	tempFileBucket,
	slugStorage,
	shortnerFunctionUrl,
}) => {
	const uploadRequest: UploadController["uploadRequest"] = async (input) => {
		const filename = createRandomString();
		const ext = path.extname(input.filename);

		const uploadUrl = await fileStorage.getPresignUploadUrl(
			tempFileBucket,
			`${input.userId}/${filename}${ext}`,
			60 * 10 // 10 minutes
		);

		// const downloadUrl = await fileStorage.getPresignDownloadUrl(
		// 	fileBucket,
		// 	`${input.userId}/${filename}${ext}`,
		// 	60 * 10 // 10 minutes
		// );

		const slug = await slugStorage.createSlug({
			filename,
			ext,
			expiresAt: 60 * 10,
		});

		return {
			slug,
			url: uploadUrl,
		};
	};

	const ackRequest: UploadController["ackRequest"] = async (input) => {
		const obj = await slugStorage.getValue(input.slug);

		if (!obj) {
			throw new Exception("NOT_FOUND", "file not exist");
		}

		const expireAt = dayjs().add(input.expiration, "hours").toDate();
		await fileStorage.moveFile(
			fileBucket,
			`${input.userId}/${obj.filename}${obj.ext}`,
			`/${tempFileBucket}/${input.userId}/${obj.filename}${obj.ext}`,
			expireAt
		);

		await slugStorage.setExpiration(input.slug, expireAt.getTime() / 1000);

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
