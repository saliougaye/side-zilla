import { FastifyInstance } from "fastify";

export default (server: FastifyInstance) => {
	const onSignal = (event: string) => {
		process.on(event, async () => {
			try {
				console.log("close server...");

				await server.close();
			} catch (error) {
				console.log("failed to close server gracefully", error);
			} finally {
				process.exit(1);
			}
		});
	};

	onSignal("SIGTERM");
	onSignal("SIGINT");
};
