import minio from "minio";
import { FileStorage } from "model/model";

type MinioServiceBuilder = (
	endpoint: string,
	user: string,
	password: string,
	port: number,
	ssl: boolean
) => FileStorage;

const createMinioService: MinioServiceBuilder = (
	endpoint: string,
	user: string,
	password: string,
	port: number,
	ssl: boolean
) => {
	const client = new minio.Client({
		endPoint: endpoint,
		port: port,
		useSSL: ssl,
		accessKey: user,
		secretKey: password,
		pathStyle: true,
	});

	const getPresignUploadUrl: FileStorage["getPresignUploadUrl"] = async (
		bucket,
		objectPath,
		expiration
	): Promise<string> => {
		const result = await client.presignedPutObject(
			bucket,
			objectPath,
			expiration
		);

		return result;
	};

	const getPresignDownloadUrl: FileStorage["getPresignDownloadUrl"] = async (
		bucket,
		objectPath,
		expiration
	) => {
		const result = await client.presignedGetObject(
			bucket,
			objectPath,
			expiration
		);

		return result;
	};

	const moveFile: FileStorage["moveFile"] = async (
		destinationBucket,
		objectPath,
		sourcePath,
		expireAt
	) => {
		await client.copyObject(
			destinationBucket,
			objectPath,
			sourcePath,
			new minio.CopyConditions()
		);

		await client.setObjectTagging(destinationBucket, objectPath, {
			expireAt: expireAt.toISOString(),
		});
	};

	return {
		getPresignUploadUrl,
		getPresignDownloadUrl,
		moveFile,
	};
};

export default createMinioService;
