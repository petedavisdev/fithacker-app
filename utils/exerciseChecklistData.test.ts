import { ExerciseDay, ExerciseLog } from '../constants/EXERCISES';
import { DateInfo } from './dateInfo';
import { getExerciseChecklistData } from './exerciseChecklistData';

describe('getExerciseChecklistData', () => {
	it('should return the correct exercise checklist data', () => {
		const inputDateInfo: DateInfo = {
			category: 'today',
			date: '2022-02-26',
			dayIndex: 6,
			text: '_.today',
		};

		const inputExerciseLog: ExerciseLog = {
			'2022-02-26': ['🚶', ['🤸', 'yoga']],
			'2022-02-25': ['💪', '🦵'],
			'2022-01-01': ['🚶', '🌴'],
		};

		const inputDayLog: ExerciseDay = ['🚶', ['🤸', 'yoga']];

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

		const result = getExerciseChecklistData(
			inputDateInfo,
			inputExerciseLog,
			inputDayLog
		);

		expect(result).toEqual(expected);
	});
});
