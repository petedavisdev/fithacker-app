import { getLanguage } from '@/shared/i18n/getLanguage';

/**
 * Formats a week range with full date info including years
 * e.g., "Jan 13 - Jan 19, 2026" or "Dec 30, 2025 - Jan 5, 2026"
 */
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
