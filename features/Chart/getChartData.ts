import type { Exercise, ExerciseLog } from '../EXERCISES';
import { getLastMonday, getToday } from '../dateInfo';

export type ChartData = {
	days: ExerciseLog;
	text: string;
	total: number;
};

export function getChartData(exerciseLog: ExerciseLog) {
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

		const text = getWeekText(Object.keys(days));
		const total = Object.values(days).flat().length;

		weeks.unshift({ days, text, total });

		if (text === '_.thisWeek') break;
	}

	return weeks;
}

const weekTextOptions = [
	{
		check: checkThisWeek,
		text: '_.thisWeek',
	},
	{
		check: () => true,
		text: '_.lastWeek',
	},
	// TODO: Add past week text formats
] as const;

function getWeekText(weekDates: string[]) {
	const option = weekTextOptions.find(({ check }) => check(weekDates))!;
	return option.text;
}

function checkThisWeek(weekDates: string[]) {
	return weekDates.includes(getToday());
}
