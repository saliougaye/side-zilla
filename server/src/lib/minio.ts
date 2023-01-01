import minio from "minio";
const createMinioService = (
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

	const getPresignUploadUrl = async (
		bucket: string,
		objectPath: string,
		expiration: number
	): Promise<string> => {
		const result = await client.presignedPutObject(
			bucket,
			objectPath,
			expiration
		);

		return result;
	};

	const getPresignDownloadUrl = async (
		bucket: string,
		objectPath: string,
		expiration: number
	): Promise<string> => {
		const result = await client.presignedGetObject(
			bucket,
			objectPath,
			expiration
		);

		return result;
	};

	return {
		getPresignUploadUrl,
		getPresignDownloadUrl,
	};
};

export default createMinioService;
