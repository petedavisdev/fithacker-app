import {
	ACTIVITIES,
	type Activity,
	ACTIVITY_PRIORITIES,
	type ActivityDay,
	type ActivityLog,
} from '../constants/ACTIVITIES';
import { DateInfo } from './dateInfo';

export function getActivityChecklist(
	dateInfo: DateInfo,
	activityLog: ActivityLog,
	dayLog: ActivityDay
) {
	const dayCounts = getDayCounts(activityLog, dateInfo.date);
	const priorityActivities = getPriorityActivities(dayCounts);
	const isDisabled = ['future', 'tomorrow'].includes(dateInfo.category);

	return ACTIVITIES.map((activity) => ({
		activity,
		isChecked: dayLog.flat().includes(activity),
		note: dayLog.find((item) => item[0] === activity)?.[1],
		dayCount: dayCounts.find((count) => count[0] === activity)?.[1],
		isPriority: priorityActivities.includes(activity),
		isDisabled,
	}));
}

function getDayCounts(
	activityLog: ActivityLog,
	date: string
): [Activity, number?][] {
	return ACTIVITIES.map((activity) => [
		activity,
		getDayCount(activity, date, activityLog),
	]);
}

function getDayCount(
	activity: Activity,
	date: string,
	activityLog: ActivityLog
) {
	const prevDate = Object.keys(activityLog)
		.filter(
			(key) => key < date && activityLog[key]?.flat().includes(activity)
		)
		.sort()
		.at(-1);

	if (!prevDate) return;

	const time = new Date(date).getTime();
	const prevTime = new Date(prevDate).getTime();

	return Math.floor((time - prevTime) / (1000 * 60 * 60 * 24));
}

function getPriorityActivities(dayCounts: [Activity, number?][]) {
	return dayCounts
		.sort(
			(countA, countB) =>
				(countB[1] ?? 1000) +
				ACTIVITY_PRIORITIES[countB[0] as Activity] -
				((countA[1] ?? 1000) +
					ACTIVITY_PRIORITIES[countA[0] as Activity])
		)
		.map((count) => count[0] as Activity)
		.slice(0, 2);
}
