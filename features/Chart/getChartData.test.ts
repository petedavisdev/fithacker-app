import { ExerciseLog } from '../EXERCISES';
import { getChartData } from './getChartData';

jest.useFakeTimers({ now: new Date('2022-02-26T00:00:00') });

describe('getWeekData', () => {
	it('should return the correct weeks and days', () => {
		const input1 = {};
		const input2 = 2;

		const expected = [
			{
				days: {
					'2022-02-21': [],
					'2022-02-22': [],
					'2022-02-23': [],
					'2022-02-24': [],
					'2022-02-25': [],
					'2022-02-26': [],
					'2022-02-27': [],
				},
				text: '_.thisWeek',
			},
			{
				days: {
					'2022-02-14': [],
					'2022-02-15': [],
					'2022-02-16': [],
					'2022-02-17': [],
					'2022-02-18': [],
					'2022-02-19': [],
					'2022-02-20': [],
				},
				text: '_.lastWeek',
			},
		];

		const result = getChartData(input1, input2);

		expect(result).toEqual(expected);
	});

	it('should return the correct exercise data', () => {
		const input1: ExerciseLog = {
			'2022-02-26': ['🚶', '🤸'],
			'2022-02-25': [
				['💪', 'pull-ups'],
				['🦵', 'squats'],
			],
		};
		const input2 = 1;

		const expected = [
			{
				days: {
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
				text: '_.thisWeek',
			},
		];

		const result = getChartData(input1, input2);

		expect(result).toEqual(expected);
	});
});
