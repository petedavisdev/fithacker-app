import { ExerciseLog } from '../constants/EXERCISES';
import { getToday } from './dateInfo';

export function getWeekData(exerciseLog: ExerciseLog, count: number) {
	const weeks: ExerciseLog[] = Array.from({ length: count }, () => ({}));

	const startDate = new Date();
	startDate.setDate(startDate.getDate() - (startDate.getDay() || 7));

	weeks.forEach((week) => {
		for (let d = 1; d <= 7; d++) {
			const currentDate = new Date(startDate);
			currentDate.setDate(currentDate.getDate() + d);
			const date = currentDate.toISOString().slice(0, 10);

			week[date] = exerciseLog[date] ?? [];
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

export function getWeekText(weekDates: string[]) {
	const option = weekTextOptions.find(({ check }) => check(weekDates))!;
	return option.text;
}

function checkThisWeek(weekDates: string[]) {
	return weekDates.includes(getToday());
}
