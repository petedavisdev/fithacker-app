import type { Exercise, ExerciseLog } from '../EXERCISES';
import { getLastMonday, getToday } from '../dateInfo';
import { checkLastWeek, checkThisWeek, getWeekText } from './getWeekText';

export type ChartData = {
	days: ExerciseLog;
	text: string;
	total: number | '🔒';
};

export function getChartData(
	exerciseLog: ExerciseLog,
	isUpgraded: boolean = false
) {
	const firstDate = Object.keys(exerciseLog).sort()[0] ?? getToday();
	let date = getLastMonday(firstDate);

	const weeks: ChartData[] = [];

	const SAFE_LIMIT = 5000;

	for (let i = 0; i < SAFE_LIMIT; i++) {
		const days: ExerciseLog = {};

		for (let d = 1; d <= 7; d++) {
			days[date] = exerciseLog[date] ?? [];

			const currentDate = new Date(date);
			currentDate.setDate(currentDate.getDate() + 1);
			date = currentDate.toISOString().slice(0, 10);
		}

		const dates = Object.keys(days);

		const isLocked = checkLocked(isUpgraded, dates);

		if (isLocked) {
			for (const date in days) {
				days[date] = ['🔒' as Exercise];
			}
		}

		const text = getWeekText(dates);
		const total = isLocked ? '🔒' : Object.values(days).flat().length;

		weeks.unshift({ days, text, total });

		if (checkThisWeek(dates)) break;
	}

	return weeks;
}

function checkLocked(isUpgraded: boolean, dates: string[]) {
	return !isUpgraded && !checkThisWeek(dates) && !checkLastWeek(dates);
}
