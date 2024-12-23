import { getToday } from '../dateInfo';

export function getDateSteps(date: string) {
	const today = getToday();
	const isFuture = date > today;
	const next = isFuture ? null : getNextDate(date);

	return {
		prev: getPrevDate(date),
		next,
	};
}

function getPrevDate(date: string) {
	const prevDate = new Date(
		new Date(date).setDate(new Date(date).getDate() - 1)
	);
	return prevDate.toISOString().slice(0, 10);
}

function getNextDate(date: string) {
	const nextDate = new Date(
		new Date(date).setDate(new Date(date).getDate() + 1)
	)
		.toISOString()
		.slice(0, 10);

	return nextDate;
}
