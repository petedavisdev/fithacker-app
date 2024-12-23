import { getDateSteps } from './getDateSteps';

jest.useFakeTimers({ now: new Date('2022-02-26T00:00:00') });

describe('getDateSteps', () => {
	it('should return the correct date steps for today', () => {
		const input = '2022-02-26';
		const expected = {
			prev: '2022-02-25',
			next: '2022-02-27',
		};

		const result = getDateSteps(input);

		expect(result).toEqual(expected);
	});

	it('should return the correct date steps for tomorrow', () => {
		const input = '2022-02-27';
		const expected = {
			prev: '2022-02-26',
			next: null,
		};

		const result = getDateSteps(input);

		expect(result).toEqual(expected);
	});

	it('should return the correct date steps for 1 January', () => {
		const input = '2022-01-01';
		const expected = {
			prev: '2021-12-31',
			next: '2022-01-02',
		};

		const result = getDateSteps(input);

		expect(result).toEqual(expected);
	});

	it('should return the correct date steps for 31 December', () => {
		const input = '2021-12-31';
		const expected = {
			prev: '2021-12-30',
			next: '2022-01-01',
		};

		const result = getDateSteps(input);

		expect(result).toEqual(expected);
	});
});
