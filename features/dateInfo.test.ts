import {
	checkThisMonth,
	checkThisYear,
	getDateInfo,
	getLastMonday,
	getToday,
} from './dateInfo';

jest.useFakeTimers({ now: new Date('2022-02-26T00:00:00') });

describe('getDateInfo', () => {
	it('should return date info for today if date is not provided', () => {
		const expected = {
			category: 'today',
			date: '2022-02-26',
			dayIndex: 6,
			text: '_.today',
		};

		const result = getDateInfo();

		expect(result).toEqual(expected);
	});

	it('should return date info for today if date is not provided', () => {
		const input = 'Not a valid date!';

		const expected = {
			category: 'today',
			date: '2022-02-26',
			dayIndex: 6,
			text: '_.today',
		};

		const result = getDateInfo(input);

		expect(result).toEqual(expected);
	});

	it('should return correct date info for today', () => {
		const input = '2022-02-26';

		const expected = {
			category: 'today',
			date: '2022-02-26',
			dayIndex: 6,
			text: '_.today',
		};

		const result = getDateInfo(input);

		expect(result).toEqual(expected);
	});

	it('should return correct date info for tomorrow', () => {
		const input = '2022-02-27';

		const expected = {
			category: 'tomorrow',
			date: '2022-02-27',
			dayIndex: 0,
			text: '_.tomorrow',
		};

		const result = getDateInfo(input);

		expect(result).toEqual(expected);
	});

	it('should return correct date info for future', () => {
		const input = '2022-02-28';

		const expected = {
			category: 'future',
			date: '2022-02-28',
			dayIndex: 1,
			text: 'Monday, February 28, 2022',
		};

		const result = getDateInfo(input);

		expect(result).toEqual(expected);
	});

	it('should return correct date info for yesterday', () => {
		const input = '2022-02-25';

		const expected = {
			category: 'weekday',
			date: '2022-02-25',
			dayIndex: 5,
			text: '_.yesterday',
		};

		const result = getDateInfo(input);

		expect(result).toEqual(expected);
	});

	it('should return correct date info for last Monday', () => {
		const input = '2022-02-21';

		const expected = {
			category: 'weekday',
			date: '2022-02-21',
			dayIndex: 1,
			text: 'Monday',
		};

		const result = getDateInfo(input);

		expect(result).toEqual(expected);
	});

	it('should return correct date info for last week', () => {
		const input = '2022-02-20';

		const expected = {
			category: 'weekend',
			date: '2022-02-20',
			dayIndex: 0,
			text: '20 Sunday',
		};

		const result = getDateInfo(input);

		expect(result).toEqual(expected);
	});

	it('should return correct date last month', () => {
		const input = '2022-01-26';

		const expected = {
			category: 'weekday',
			date: '2022-01-26',
			dayIndex: 3,
			text: 'Wednesday, January 26',
		};

		const result = getDateInfo(input);

		expect(result).toEqual(expected);
	});

	it('should return correct date last year', () => {
		const input = '2021-12-26';

		const expected = {
			category: 'weekend',
			date: '2021-12-26',
			dayIndex: 0,
			text: 'Sunday, December 26, 2021',
		};

		const result = getDateInfo(input);

		expect(result).toEqual(expected);
	});
});

describe('getToday', () => {
	it("should return today's date", () => {
		const expected = '2022-02-26';

		const result = getToday();

		expect(result).toEqual(expected);
	});
});

describe('getLastMonday', () => {
	it("should return last Monday's date", () => {
		const expected = '2022-02-21';

		const result = getLastMonday();

		expect(result).toEqual(expected);
	});
	it('should return previous Monday from given date', () => {
		const input = '2022-02-20';

		const expected = '2022-02-14';

		const result = getLastMonday(input);

		expect(result).toEqual(expected);
	});
	it('should return current date if input is a Monday', () => {
		const input = '2022-02-07';

		const expected = '2022-02-07';

		const result = getLastMonday(input);

		expect(result).toEqual(expected);
	});
});

describe('checkThisMonth', () => {
	it('should return true if date is in this month', () => {
		const input = '2022-02-01';

		const expected = true;

		const result = checkThisMonth(input);

		expect(result).toEqual(expected);
	});
	it('should return false if date is not in this month', () => {
		const input = '2022-01-01';

		const expected = false;

		const result = checkThisMonth(input);

		expect(result).toEqual(expected);
	});
});

describe('checkThisYear', () => {
	it('should return true if date is in this week', () => {
		const input = '2022-01-01';

		const expected = true;

		const result = checkThisYear(input);

		expect(result).toEqual(expected);
	});
	it('should return false if date is not in this week', () => {
		const input = '2021-12-31';

		const expected = false;

		const result = checkThisYear(input);

		expect(result).toEqual(expected);
	});
});
