export const ACTIVITIES = ['🚶', '🏃‍♀️', '🤸', '💪', '🌴', '🦵'] as const;
export type Activity = (typeof ACTIVITIES)[number];
export type ActivityItem = Activity | [Activity, string];
export type ActivityDay = ActivityItem[];
export type ActivityLog = Record<string, ActivityDay | undefined>;
export const ACTIVITY_TARGETS = {
	'🚶': 1,
	'🏃‍♀️': 3,
	'🤸': 3,
	'💪': 7,
	'🌴': 7,
	'🦵': 7,
};
