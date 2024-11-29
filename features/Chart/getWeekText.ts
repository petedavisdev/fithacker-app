import { checkThisMonth, checkThisYear, getToday } from '../dateInfo';
import { getLanguage } from '../getLanguage';

type WeekTextOption = {
	check: (dates: string[]) => boolean;
	text: (dates: string[]) => string;
};

const weekTextOptions: WeekTextOption[] = [
	{
		check: checkThisWeek,
		text: () => '_.thisWeek',
	},
	{
		check: checkLastWeek,
		text: () => '_.lastWeek',
	},
	{
		check: (dates: string[]) => checkThisMonth(dates[0]),
		text: (dates: string[]) => formatWeekShort(dates[0], dates[6]),
	},
	{
		check: (dates: string[]) => checkThisYear(dates[0]),
		text: (dates: string[]) => formatWeekLong(dates[0], dates[6]),
	},
	{
		check: () => true,
		text: (dates: string[]) => formatWeekFull(dates[0], dates[6]),
	},
] as const;

export function getWeekText(dates: string[]) {
	const option = weekTextOptions.find(({ check }) => check(dates))!;
	return option.text(dates);
}

export function checkThisWeek(dates: string[]) {
	return dates.includes(getToday());
}

export function checkLastWeek(dates: string[]) {
	const dateAWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7))
		.toISOString()
		.slice(0, 10);

	return dates.includes(dateAWeekAgo);
}

function formatWeekShort(firstDate: string, lastDate: string) {
	const firstDateText = +firstDate.slice(8, 10);
	const lastDateText = formatDayMonth(lastDate);

	return `${firstDateText} - ${lastDateText}`;
}

function formatWeekLong(firstDate: string, lastDate: string) {
	const firstDateText = formatDayMonth(firstDate);
	const lastDateText = formatDayMonth(lastDate);

	return `${firstDateText} - ${lastDateText}`;
}

function formatWeekFull(firstDate: string, lastDate: string) {
	const firstDateText = new Date(firstDate).toLocaleDateString(
		getLanguage(),
		{
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		}
	);
	const lastDateText = formatDayMonth(lastDate);

	return `${firstDateText} - ${lastDateText}`;
}

function formatDayMonth(date: string) {
	return new Date(date).toLocaleDateString(getLanguage(), {
		month: 'short',
		day: 'numeric',
	});
}
