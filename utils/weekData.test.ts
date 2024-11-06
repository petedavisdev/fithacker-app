import { ExerciseLog } from '../constants/EXERCISES';
import { getWeekData, getWeekText } from './weekData';

jest.useFakeTimers({ now: new Date('2022-02-26T00:00:00') });

describe('getWeekData', () => {
	it('should return the correct weeks and days', () => {
		const count = 2;
		const data = {};

		const expected = [
			{
				'2022-02-21': [],
				'2022-02-22': [],
				'2022-02-23': [],
				'2022-02-24': [],
				'2022-02-25': [],
				'2022-02-26': [],
				'2022-02-27': [],
			},
			{
				'2022-02-14': [],
				'2022-02-15': [],
				'2022-02-16': [],
				'2022-02-17': [],
				'2022-02-18': [],
				'2022-02-19': [],
				'2022-02-20': [],
			},
		];

		const result = getWeekData(data, count);

		expect(result).toEqual(expected);
	});

	it('should return the correct exercise data', () => {
		const count = 1;
		const data: ExerciseLog = {
			'2022-02-26': ['🚶', '🤸'],
			'2022-02-25': [
				['💪', 'pull-ups'],
				['🦵', 'squats'],
			],
		};

		const expected = [
			{
				'2022-02-21': [],
				'2022-02-22': [],
				'2022-02-23': [],
				'2022-02-24': [],
				'2022-02-25': [
					['💪', 'pull-ups'],
					['🦵', 'squats'],
				],

				'2022-02-26': ['🚶', '🤸'],
				'2022-02-27': [],
			},
		];

		const result = getWeekData(data, count);

		expect(result).toEqual(expected);
	});
});

describe('getWeekText', () => {
	it('should return the this week text', () => {
		const input = ['2022-02-26'];
		const expected = '_.thisWeek';

		const result = getWeekText(input);

		expect(result).toEqual(expected);
	});

	it('should return the last week text', () => {
		const input = ['2022-02-19'];
		const expected = '_.lastWeek';

		const result = getWeekText(input);

		expect(result).toEqual(expected);
	});
});
