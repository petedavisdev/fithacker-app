export const ACTIVITIES = ['🚶', '🏃‍♀️', '🤸', '💪', '🌴', '🦵'] as const;
export type Activity = (typeof ACTIVITIES)[number];
export type ActivityItem = Activity | [Activity, string];
export type ActivityDay = ActivityItem[];
export type ActivityLog = Record<string, ActivityDay>;
