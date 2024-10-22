import * as Localization from 'expo-localization';

// Accepts date format 'YYYY-MM-DD' and returns information about the date
type DateInfo = {
	date: string;
	dayIndex: number;
	text: string;
	category: 'future' | 'today' | 'weekend' | 'weekday';
};

export function getDateInfo(dateVal: string): DateInfo {
	const today = new Date().toISOString().slice(0, 10);

	// If date is not valid, use today
	const date = dateVal && Date.parse(dateVal.toString()) ? dateVal : today;
	const jsDate = new Date(date);
	const dayIndex = jsDate.getDay();

	// Future
	if (date > today) {
		return {
			date,
			dayIndex,
			text: jsDate.toLocaleDateString(undefined, {
				dateStyle: 'full',
			}),
			category: 'future',
		};
	}

	// Today
	if (date === today) {
		return {
			date,
			dayIndex,
			text: date === dateVal ? '_.today' : '_.whatExerciseToday',
			category: 'today',
		};
	}

	// Weekday or weekend
	const isWeekend = [0, 6].includes(dayIndex);
	const category = isWeekend ? 'weekend' : 'weekday';

	// Yesterday
	const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
		.toISOString()
		.slice(0, 10);
	if (date === yesterday) {
		return {
			date,
			dayIndex,
			text: '_.yesterday',
			category,
		};
	}

	// This week
	const lastMonday =
		new Date().getDay() === 1
			? new Date().toISOString().slice(0, 10)
			: new Date(
					new Date().setDate(
						new Date().getDate() -
							new Date().getDay() +
							(new Date().getDay() === 0 ? -6 : 1)
					)
			  )
					.toISOString()
					.slice(0, 10);

	const lng = Localization.getLocales()?.[0]?.languageTag;

	if (date >= lastMonday) {
		return {
			date,
			category,
			dayIndex,
			text: new Date(date).toLocaleDateString(lng, {
				weekday: 'long',
			}),
		};
	}

	// This month
	const isCurrentMonth = date.slice(0, 7) === today.slice(0, 7);
	if (isCurrentMonth) {
		return {
			date,
			category,
			dayIndex,
			text: new Date(date).toLocaleDateString(lng, {
				weekday: 'long',
				day: 'numeric',
			}),
		};
	}

	// This year
	const isCurrentYear = date.slice(0, 4) === today.slice(0, 4);
	if (isCurrentYear) {
		return {
			date,
			category,
			dayIndex,
			text: new Date(date).toLocaleDateString(lng, {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
			}),
		};
	}

	// Past years
	return {
		date,
		category,
		dayIndex,
		text: new Date(date).toLocaleDateString(lng, {
			dateStyle: 'full',
		}),
	};
}
