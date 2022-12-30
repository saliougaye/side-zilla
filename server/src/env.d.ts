namespace NodeJS {
	interface ProcessEnv {
		PORT: number | undefined;
		HOST: string | undefined;
		MINIO_USER: string;
		MINIO_PASSWORD: string;
		MINIO_REGION: string;
		MINIO_ENDPOINT: string;
		MINIO_PORT: number;
		MINIO_FILE_BUCKET: string;
		REDIS_URL: string;
	}
}
