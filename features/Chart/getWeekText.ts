import { checkThisYear, getDate } from '@/shared/utils/dateInfo';
import { getLanguage } from '@/shared/i18n/getLanguage';
import { TIMING } from '@/shared/utils/constants';
import { formatWeekFull } from '@/shared/utils/formatWeek';

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

function formatWeekLong(firstDate: string, lastDate: string) {
	const firstDateText = formatDayMonth(firstDate);
	const lastDateText = formatDayMonth(lastDate);

	return `${firstDateText} - ${lastDateText}`;
}

function formatDayMonth(date: string) {
	return new Date(date).toLocaleDateString(getLanguage(), {
		month: 'short',
		day: 'numeric',
	});
}
