export const ACTIVITIES = ['🚶', '🏃‍♀️', '🤸', '💪', '🌴', '🦵'] as const;

export type Activity = (typeof ACTIVITIES)[number];
export type ActivityItem = Activity | [Activity, string];
export type ActivityDay = ActivityItem[];
export type ActivityLog = Record<string, ActivityDay | undefined>;

export const ACTIVITY_PRIORITIES: Record<Activity, number> = {
	'🚶': 2,
	'🦵': 0.9,
	'🤸': 0.7,
	'🏃‍♀️': 0.5,
	'🌴': 0.3,
	'💪': 0.1,
};
