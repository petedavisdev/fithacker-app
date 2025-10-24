import { getDate } from '../dateInfo';

export function getDateSteps(date: string) {
	const today = getDate();
	const isFuture = date > today;
	const next = isFuture ? null : getNextDate(date);

	return {
		prev: getPrevDate(date),
		next,
	};
}

function getPrevDate(date: string) {
	const prevDate = new Date(
		new Date(date).setDate(new Date(date).getDate() - 1),
	);
	return getDate(prevDate);
}

function getNextDate(date: string) {
	const nextDate = new Date(
		new Date(date).setDate(new Date(date).getDate() + 1),
	);

	return getDate(nextDate);
}
