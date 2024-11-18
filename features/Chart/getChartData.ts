import { ExerciseLog } from '../EXERCISES';
import { getToday } from '../dateInfo';

export type ChartData = {
	days: ExerciseLog;
	text: string;
};

export function getChartData(exerciseLog: ExerciseLog, count: number) {
	const weeks: ChartData[] = Array.from({ length: count }, () => ({
		days: {},
		text: '',
	}));

	const startDate = new Date();
	startDate.setDate(startDate.getDate() - (startDate.getDay() || 7));

	weeks.forEach((week) => {
		for (let d = 1; d <= 7; d++) {
			const currentDate = new Date(startDate);
			currentDate.setDate(currentDate.getDate() + d);
			const date = currentDate.toISOString().slice(0, 10);

			week.days[date] = exerciseLog[date] ?? [];
			week.text = getWeekText(Object.keys(week.days));
		}
		startDate.setDate(startDate.getDate() - 7);
	});

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
