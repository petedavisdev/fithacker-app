import { checkLastWeek, checkThisWeek, getWeekText } from './getWeekText';

jest.useFakeTimers({ now: new Date('2022-02-26T00:00:00') });

describe('getWeekText', () => {
	it('should return this week', () => {
		const dates = [
			'2022-02-21',
			'2022-02-22',
			'2022-02-23',
			'2022-02-24',
			'2022-02-25',
			'2022-02-26',
			'2022-02-27',
		];

		const expected = '_.thisWeek';

		const result = getWeekText(dates);

		expect(result).toEqual(expected);
	});

	it('should return last week', () => {
		const dates = [
			'2022-02-14',
			'2022-02-15',
			'2022-02-16',
			'2022-02-17',
			'2022-02-18',
			'2022-02-19',
			'2022-02-20',
		];

		const expected = '_.lastWeek';

		const result = getWeekText(dates);

		expect(result).toEqual(expected);
	});

	it('should return previous week', () => {
		const dates = [
			'2022-02-07',
			'2022-02-08',
			'2022-02-09',
			'2022-02-10',
			'2022-02-11',
			'2022-02-12',
			'2022-02-13',
		];

		const expected = '7 - Feb 13';

		const result = getWeekText(dates);

		expect(result).toEqual(expected);
	});

	it('should return a week from january this year', () => {
		const dates = [
			'2022-01-31',
			'2022-02-01',
			'2022-02-02',
			'2022-02-03',
			'2022-02-04',
			'2022-02-05',
			'2022-02-06',
		];

		const expected = 'Jan 31 - Feb 6';

		const result = getWeekText(dates);

		expect(result).toEqual(expected);
	});

	it('should return a week last year', () => {
		const dates = [
			'2021-12-28',
			'2021-12-29',
			'2021-12-30',
			'2021-12-31',
			'2022-01-01',
			'2022-01-02',
			'2022-01-03',
		];

		const expected = 'Dec 28, 2021 - Jan 3';

		const result = getWeekText(dates);

		expect(result).toEqual(expected);
	});
});

describe('checkThisWeek', () => {
	it('should return true', () => {
		const dates = [
			'2022-02-21',
			'2022-02-22',
			'2022-02-23',
			'2022-02-24',
			'2022-02-25',
			'2022-02-26',
			'2022-02-27',
		];

		const expected = true;

		const result = checkThisWeek(dates);

		expect(result).toEqual(expected);
	});
});

describe('checkLastWeek', () => {
	it('should return true', () => {
		const dates = [
			'2022-02-14',
			'2022-02-15',
			'2022-02-16',
			'2022-02-17',
			'2022-02-18',
			'2022-02-19',
			'2022-02-20',
		];

		const expected = true;

		const result = checkLastWeek(dates);

		expect(result).toEqual(expected);
	});
});
