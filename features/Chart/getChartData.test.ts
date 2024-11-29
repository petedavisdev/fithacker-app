import { ExerciseLog } from '../EXERCISES';
import { getChartData } from './getChartData';

jest.useFakeTimers({ now: new Date('2022-02-26T00:00:00') });

describe('getWeekData', () => {
	it('should return the correct weeks and days', () => {
		const input: ExerciseLog = { '2022-02-14': ['💪'] };

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
				total: 0,
			},
			{
				days: {
					'2022-02-14': ['💪'],
					'2022-02-15': [],
					'2022-02-16': [],
					'2022-02-17': [],
					'2022-02-18': [],
					'2022-02-19': [],
					'2022-02-20': [],
				},
				text: '_.lastWeek',
				total: 1,
			},
		];

		const result = getChartData(input, true);

		expect(result).toEqual(expected);
	});

	it('should return the correct exercise data', () => {
		const input: ExerciseLog = {
			'2022-02-26': ['🚶', '🤸'],
			'2022-02-25': [
				['💪', 'pull-ups'],
				['🦵', 'squats'],
			],
		};

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
				total: 4,
			},
		];

		const result = getChartData(input);

		expect(result).toEqual(expected);
	});

	it('should return locked results when not upgraded', () => {
		const input: ExerciseLog = {
			'2022-02-14': ['💪'],
			'2022-02-07': ['🚶', ['🤸', 'yoga']],
		};

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
				total: 0,
			},
			{
				days: {
					'2022-02-14': ['💪'],
					'2022-02-15': [],
					'2022-02-16': [],
					'2022-02-17': [],
					'2022-02-18': [],
					'2022-02-19': [],
					'2022-02-20': [],
				},
				text: '_.lastWeek',
				total: 1,
			},
			{
				days: {
					'2022-02-07': ['🔒'],
					'2022-02-08': ['🔒'],
					'2022-02-09': ['🔒'],
					'2022-02-10': ['🔒'],
					'2022-02-11': ['🔒'],
					'2022-02-12': ['🔒'],
					'2022-02-13': ['🔒'],
				},
				text: '7 - Feb 13',
				total: '🔒',
			},
		];

		const result = getChartData(input);

		expect(result).toEqual(expected);
	});

	it('should return unlocked results when upgraded', () => {
		const input1: ExerciseLog = {
			'2022-02-14': ['💪'],
			'2022-02-07': ['🚶', ['🤸', 'yoga']],
		};

		const input2 = true;

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
				total: 0,
			},
			{
				days: {
					'2022-02-14': ['💪'],
					'2022-02-15': [],
					'2022-02-16': [],
					'2022-02-17': [],
					'2022-02-18': [],
					'2022-02-19': [],
					'2022-02-20': [],
				},
				text: '_.lastWeek',
				total: 1,
			},
			{
				days: {
					'2022-02-07': ['🚶', ['🤸', 'yoga']],
					'2022-02-08': [],
					'2022-02-09': [],
					'2022-02-10': [],
					'2022-02-11': [],
					'2022-02-12': [],
					'2022-02-13': [],
				},
				text: '7 - Feb 13',
				total: 2,
			},
		];

		const result = getChartData(input1, input2);

		expect(result).toEqual(expected);
	});
});
