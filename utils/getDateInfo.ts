// Accepts date format 'YYYY-MM-DD' and returns information about the date
type DateInfo = {
	dayIndex: number;
	text: string;
	category: 'future' | 'today' | 'weekend' | 'weekday';
};

export function getDateInfo(date: string): DateInfo {
	const today = new Date().toISOString().slice(0, 10);

	// If date is not valid, use today
	date = date && Date.parse(date.toString()) ? date : today;
	const jsDate = new Date(date);
	const dayIndex = jsDate.getDay();

	// Future
	if (date > today) {
		return {
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
			dayIndex,
			text: '_.today',
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
	if (date >= lastMonday) {
		return {
			category,
			dayIndex,
			text: new Date(date).toLocaleDateString(undefined, {
				weekday: 'long',
			}),
		};
	}

	// This year
	const isCurrentYear = date.slice(0, 4) === today.slice(0, 4);
	if (isCurrentYear) {
		return {
			category,
			dayIndex,
			text: new Date(date).toLocaleDateString(undefined, {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
			}),
		};
	}

	// Past years
	return {
		category,
		dayIndex,
		text: new Date(date).toLocaleDateString(undefined, {
			dateStyle: 'full',
		}),
	};
}
