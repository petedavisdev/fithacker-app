import { ExerciseDay, ExerciseLog } from '../constants/EXERCISES';
import { DateInfo } from './dateInfo';
import { getChecklistData } from './exerciseChecklistData';

describe('getChecklistData', () => {
	it('should return the correct exercise checklist data', () => {
		const input1: DateInfo = {
			category: 'today',
			date: '2022-02-26',
			dayIndex: 6,
			text: '_.today',
		};

		const input2: ExerciseLog = {
			'2022-02-26': ['🚶', ['🤸', 'yoga']],
			'2022-02-25': ['💪', '🦵'],
			'2022-01-01': ['🚶', '🌴'],
		};

		const input3: ExerciseDay = ['🚶', ['🤸', 'yoga']];

		const expected = [
			{
				exercise: '🚶',
				isChecked: true,
				note: undefined,
				dayCount: 56,
				isPriority: false,
			},
			{
				exercise: '🏃‍♀️',
				isChecked: false,
				note: undefined,
				dayCount: undefined,
				isPriority: true,
			},
			{
				exercise: '🤸',
				isChecked: true,
				note: 'yoga',
				dayCount: undefined,
				isPriority: true,
			},
			{
				exercise: '💪',
				isChecked: false,
				note: undefined,
				dayCount: 1,
				isPriority: false,
			},
			{
				exercise: '🌴',
				isChecked: false,
				note: undefined,
				dayCount: 56,
				isPriority: false,
			},
			{
				exercise: '🦵',
				isChecked: false,
				note: undefined,
				dayCount: 1,
				isPriority: false,
			},
		];

		const result = getChecklistData(input1, input2, input3);

		expect(result).toEqual(expected);
	});
});
