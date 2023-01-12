export type Plan = {
	id: string;
	name: string;
	configuration: PlanConfiguration;
};

interface PlanConfiguration {
	maxSize: number;
	maxDailyUpload: number;
	uploadExpiration: number;
}
