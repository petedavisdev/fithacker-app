import { getDateInfo, getToday } from './dateInfo';

jest.useFakeTimers({ now: new Date('2022-02-26T00:00:00') });

describe('getDateInfo', () => {
	it('should return date info for today if date is not provided', () => {
		const dateInfo = getDateInfo();

		expect(dateInfo).toEqual({
			category: 'today',
			date: '2022-02-26',
			dayIndex: 6,
			text: '_.today',
		});
	});

	it('should return date info for today if date is not provided', () => {
		const dateInfo = getDateInfo('Not a valid date!');

		expect(dateInfo).toEqual({
			category: 'today',
			date: '2022-02-26',
			dayIndex: 6,
			text: '_.today',
		});
	});

	it('should return correct date info for today', () => {
		const dateInfo = getDateInfo('2022-02-26');

		expect(dateInfo).toEqual({
			category: 'today',
			date: '2022-02-26',
			dayIndex: 6,
			text: '_.today',
		});
	});

	it('should return correct date info for tomorrow', () => {
		const dateInfo = getDateInfo('2022-02-27');

		expect(dateInfo).toEqual({
			category: 'tomorrow',
			date: '2022-02-27',
			dayIndex: 0,
			text: '_.tomorrow',
		});
	});

	it('should return correct date info for future', () => {
		const dateInfo = getDateInfo('2022-02-28');

		expect(dateInfo).toEqual({
			category: 'future',
			date: '2022-02-28',
			dayIndex: 1,
			text: 'Monday, February 28, 2022',
		});
	});

	it('should return correct date info for yesterday', () => {
		const dateInfo = getDateInfo('2022-02-25');

		expect(dateInfo).toEqual({
			category: 'weekday',
			date: '2022-02-25',
			dayIndex: 5,
			text: '_.yesterday',
		});
	});

	it('should return correct date info for last Monday', () => {
		const dateInfo = getDateInfo('2022-02-21');

		expect(dateInfo).toEqual({
			category: 'weekday',
			date: '2022-02-21',
			dayIndex: 1,
			text: 'Monday',
		});
	});

	it('should return correct date info for last week', () => {
		const dateInfo = getDateInfo('2022-02-20');

		expect(dateInfo).toEqual({
			category: 'weekend',
			date: '2022-02-20',
			dayIndex: 0,
			text: '20 Sunday',
		});
	});

	it('should return correct date last month', () => {
		const dateInfo = getDateInfo('2022-01-26');

		expect(dateInfo).toEqual({
			category: 'weekday',
			date: '2022-01-26',
			dayIndex: 3,
			text: 'Wednesday, January 26',
		});
	});

	it('should return correct date last year', () => {
		const dateInfo = getDateInfo('2021-12-26');

		expect(dateInfo).toEqual({
			category: 'weekend',
			date: '2021-12-26',
			dayIndex: 0,
			text: 'Sunday, December 26, 2021',
		});
	});
});

describe('getToday', () => {
	it("should return today's date", () => {
		const today = getToday();

		expect(today).toEqual('2022-02-26');
	});
});
