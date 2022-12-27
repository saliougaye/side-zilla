import dotenv from "dotenv";

dotenv.config();

const requiredKeys = [
	"MINIO_USER",
	"MINIO_PASSWORD",
	"MINIO_REGION",
	"MINIO_ENDPOINT",
	"MINIO_PORT",
	"MINIO_FILE_BUCKET",
];

requiredKeys.forEach((el) => {
	if (!process.env[el]) {
		throw new Error(`required env '${el}' not defined`);
	}
});

const config = {
	port: process.env.PORT ? Number(process.env.PORT) : 8080,
	host: process.env.HOST ?? "0.0.0.0",
	minio: {
		user: process.env.MINIO_USER,
		password: process.env.MINIO_PASSWORD,
		region: process.env.MINIO_REGION,
		endpoint: process.env.MINIO_ENDPOINT,
		port: Number(process.env.MINIO_PORT),
		fileBucket: process.env.MINIO_FILE_BUCKET,
	},
};

export default config;
