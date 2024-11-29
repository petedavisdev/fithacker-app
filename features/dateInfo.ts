import { getLanguage } from './getLanguage';

type DateCategory = 'today' | 'tomorrow' | 'future' | 'weekend' | 'weekday';

export type DateInfo = {
	category: DateCategory;
	date: string;
	dayIndex: number;
	text: string;
};

type DateInfoOption = {
	check: (date: string) => boolean;
	category: (dayIndex: number) => DateCategory;
	text: (date: string) => string;
};

const dateInfoOptions: DateInfoOption[] = [
	{
		check: checkToday,
		category: () => 'today',
		text: () => '_.today',
	},
	{
		check: checkTomorrow,
		category: () => 'tomorrow',
		text: () => '_.tomorrow',
	},
	{
		check: checkFuture,
		category: () => 'future',
		text: formatDateFull,
	},
	{
		check: checkYesterday,
		category: getWeekdayCategory,
		text: () => '_.yesterday',
	},
	{
		check: checkThisWeek,
		category: getWeekdayCategory,
		text: formatDateShort,
	},
	{
		check: checkThisMonth,
		category: getWeekdayCategory,
		text: formatDateMedium,
	},
	{
		check: checkThisYear,
		category: getWeekdayCategory,
		text: formatDateLong,
	},
	{
		check: () => true,
		category: getWeekdayCategory,
		text: formatDateFull,
	},
] as const;

export function getDateInfo(dateVal?: string): DateInfo {
	const date = getValidDate(dateVal);
	const dayIndex = new Date(date).getDay();

	const dateOption = dateInfoOptions.find(({ check }) => check(date))!;

	return {
		category: dateOption.category(dayIndex),
		date,
		dayIndex,
		text: dateOption.text(date),
	};
}

export function getToday() {
	return new Date().toISOString().slice(0, 10);
}

function getValidDate(date?: string) {
	return date && Date.parse(date) ? date : getToday();
}

function checkToday(date: string) {
	return date === getToday();
}

function checkTomorrow(date: string) {
	const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
	return date === tomorrow.toISOString().slice(0, 10);
}

function checkYesterday(date: string) {
	const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
	return date === yesterday.toISOString().slice(0, 10);
}

function checkFuture(date: string) {
	return date > getToday();
}

export function getLastMonday(dateVal?: string) {
	const date = getValidDate(dateVal);
	const jsDate = new Date(date);

	if (jsDate.getDay() === 1) return date;

	const lastMonday = new Date(
		new Date().setDate(
			jsDate.getDate() -
				jsDate.getDay() +
				(jsDate.getDay() === 0 ? -6 : 1)
		)
	);
	return lastMonday.toISOString().slice(0, 10);
}

function checkThisWeek(date: string) {
	return date >= getLastMonday();
}

export function checkThisMonth(date: string) {
	return date.slice(0, 7) === getToday().slice(0, 7);
}

export function checkThisYear(date: string) {
	return date.slice(0, 4) === getToday().slice(0, 4);
}

function getWeekdayCategory(dayIndex: number) {
	return [0, 6].includes(dayIndex) ? 'weekend' : 'weekday';
}

function formatDateShort(date: string) {
	return new Date(date).toLocaleDateString(getLanguage(), {
		weekday: 'long',
	});
}

function formatDateMedium(date: string) {
	return new Date(date).toLocaleDateString(getLanguage(), {
		weekday: 'long',
		day: 'numeric',
	});
}

function formatDateLong(date: string) {
	return new Date(date).toLocaleDateString(getLanguage(), {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	});
}

function formatDateFull(date: string) {
	return new Date(date).toLocaleDateString(getLanguage(), {
		dateStyle: 'full',
	});
}
