import type { ExerciseLog, Badge } from '@/shared/utils/constants';
import { getLastMonday, getDate } from '@/shared/utils/dateInfo';
import { checkThisWeek, getWeekText } from './getWeekText';
import { LIMITS, DAYS } from '@/shared/utils/constants';
import { calculateBadges } from '@/shared/utils/calculateBadges';

export type ChartData = {
	days: ExerciseLog;
	text: string;
	total: number;
	badges: Badge[];
};

export function getChartData(exerciseLog: ExerciseLog) {
	const firstDate = Object.keys(exerciseLog).sort()[0] ?? getDate();
	let date = getLastMonday(firstDate);

	const weeks: ChartData[] = [];

	for (let i = 0; i < LIMITS.CHART_WEEKS_SAFE_LIMIT; i++) {
		const days: ExerciseLog = {};

		for (let d = 1; d <= DAYS.PER_WEEK; d++) {
			days[date] = exerciseLog[date] ?? [];

			const currentDate = new Date(date);
			currentDate.setDate(currentDate.getDate() + 1);
			date = getDate(currentDate);
		}

		const dates = Object.keys(days);
		const text = getWeekText(dates);
		const total = Object.values(days).flat().length;
		const badges = calculateBadges(days);

		weeks.unshift({ days, text, total, badges });

		if (checkThisWeek(dates)) break;
	}

	return weeks;
}
