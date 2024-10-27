import * as Localization from 'expo-localization';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export type DateInfo = {
	date: string;
	dayIndex: number;
	category: 'today' | 'tomorrow' | 'future' | 'weekend' | 'weekday';
	text: string;
};

export function getDateInfo(dateVal: string): DateInfo {
	const today = getToday();
	const date = Date.parse(dateVal) ? dateVal : today;
	const dayIndex = new Date(date).getDay();

	const isToday = date === today;
	if (isToday) {
		return {
			date,
			dayIndex,
			category: 'today',
			text: date === dateVal ? '_.today' : '_.whatExerciseToday',
		};
	}

	const isTomorrow = date === getTomorrow();
	if (isTomorrow) {
		return {
			date,
			dayIndex,
			category: 'tomorrow',
			text: '_.tomorrow',
		};
	}

	const language = Localization.getLocales()?.[0]?.languageTag;

	const isFuture = date > today;
	if (isFuture) {
		return {
			date,
			dayIndex,
			category: 'future',
			text: new Date(date).toLocaleDateString(language, {
				dateStyle: 'full',
			}),
		};
	}

	const isWeekend = [0, 6].includes(dayIndex);
	const category = isWeekend ? 'weekend' : 'weekday';

	const isYesterday = date === getYesterday();
	if (isYesterday) {
		return {
			date,
			dayIndex,
			category,
			text: '_.yesterday',
		};
	}

	const isThisWeek = date >= getLastMonday();
	if (isThisWeek) {
		return {
			date,
			category,
			dayIndex,
			text: new Date(date).toLocaleDateString(language, {
				weekday: 'long',
			}),
		};
	}

	const isCurrentMonth = date.slice(0, 7) === today.slice(0, 7);
	if (isCurrentMonth) {
		return {
			date,
			dayIndex,
			category,
			text: new Date(date).toLocaleDateString(language, {
				weekday: 'long',
				day: 'numeric',
			}),
		};
	}

	const isCurrentYear = date.slice(0, 4) === today.slice(0, 4);
	if (isCurrentYear) {
		return {
			date,
			dayIndex,
			category,
			text: new Date(date).toLocaleDateString(language, {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
			}),
		};
	}

	return {
		date,
		dayIndex,
		category,
		text: new Date(date).toLocaleDateString(language, {
			dateStyle: 'full',
		}),
	};
}

function getToday() {
	return new Date().toISOString().slice(0, 10);
}

function getTomorrow() {
	const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
	return tomorrow.toISOString().slice(0, 10);
}

function getYesterday() {
	const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
	return yesterday.toISOString().slice(0, 10);
}

function getLastMonday() {
	if (new Date().getDay() === 1) return getToday();

	const lastMonday = new Date(
		new Date().setDate(
			new Date().getDate() -
				new Date().getDay() +
				(new Date().getDay() === 0 ? -6 : 1)
		)
	);

	return lastMonday.toISOString().slice(0, 10);
}
