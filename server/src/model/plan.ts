export type Plan = {
	id: string;
	name: string;
	configuration: PlanConfiguration;
};

export interface PlanConfiguration {
	maxSize: number;
	maxDailyUpload: number;
	uploadExpiration: number;
}
