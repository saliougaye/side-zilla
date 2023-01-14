export type Plan = {
	id: string;
	name: string;
	configuration: PlanConfiguration | null;
};

export interface PlanConfiguration {
	maxSize: number;
	maxDailyUpload: number;
	uploadExpiration: number;
}
