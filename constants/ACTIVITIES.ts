export const ACTIVITIES = ['🚶', '🏃‍♀️', '🤸', '💪', '🌴', '🦵'] as const;
export type Activity = (typeof ACTIVITIES)[number];
export type ActivityDay = (Activity | [Activity, string])[];
export type ActivityLog = Record<string, ActivityDay>;
