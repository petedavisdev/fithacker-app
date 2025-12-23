import {
	checkThisMonth,
	checkThisYear,
	getDate,
} from '@/shared/utils/dateInfo';
import { getLanguage } from '@/shared/i18n/getLanguage';
import { TIMING } from '@/shared/utils/constants';

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
	return dates.includes(getDate());
}

export function checkLastWeek(dates: string[]) {
	const dateAWeekAgo = getDate(new Date(Date.now() - TIMING.WEEK_MS));

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

export function formatWeekFull(firstDate: string, lastDate: string) {
	const firstDateObj = new Date(firstDate);
	const lastDateObj = new Date(lastDate);
	const firstDateYear = firstDateObj.getFullYear();
	const lastDateYear = lastDateObj.getFullYear();
	const firstDateMonth = firstDateObj.getMonth();
	const lastDateMonth = lastDateObj.getMonth();

	const firstDateText =
		firstDateMonth === lastDateMonth && firstDateYear === lastDateYear
			? firstDateObj.getDate().toString()
			: firstDateObj.toLocaleDateString(getLanguage(), {
					month: 'short',
					day: 'numeric',
					...(firstDateYear !== lastDateYear && { year: 'numeric' }),
				});
	const lastDateText = lastDateObj.toLocaleDateString(getLanguage(), {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});

	return `${firstDateText} - ${lastDateText}`;
}

function formatDayMonth(date: string) {
	return new Date(date).toLocaleDateString(getLanguage(), {
		month: 'short',
		day: 'numeric',
	});
}
