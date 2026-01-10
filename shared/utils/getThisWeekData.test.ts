import { getThisWeekData } from './getThisWeekData';
import type { ExerciseLog } from './constants';

jest.useFakeTimers({ now: new Date('2022-02-26T00:00:00') }); // Saturday

describe('getThisWeekData', () => {
	it('should return empty week data when log is empty', () => {
		const log: ExerciseLog = {};
		const result = getThisWeekData(log);
		expect(result.count).toBe(0);
		expect(result.badges).toEqual([]);
		expect(Object.keys(result.days).length).toBe(7);
	});

	it('should extract this week data correctly', () => {
		const log: ExerciseLog = {
			'2022-02-21': ['🚶', '🏃‍♀️'], // Monday
			'2022-02-22': ['🤸'], // Tuesday
			'2022-02-23': ['💪'], // Wednesday
			'2022-02-24': ['🌴'], // Thursday
			'2022-02-25': ['🦵'], // Friday
			'2022-02-26': ['🚶'], // Saturday
			'2022-02-27': [], // Sunday
			'2022-02-20': ['🚶'], // Previous week
		};
		const result = getThisWeekData(log);
		expect(result.count).toBe(7);
		expect(result.badges).toEqual(['🏅']); // All 6 exercises appear at least once
		expect(result.days['2022-02-21']).toEqual(['🚶', '🏃‍♀️']);
		expect(result.days['2022-02-20']).toBeUndefined(); // Not in this week
	});

	it('should calculate badges correctly', () => {
		const log: ExerciseLog = {
			'2022-02-21': ['🚶', '🏃‍♀️'],
			'2022-02-22': ['🤸', '💪'],
			'2022-02-23': ['🌴', '🦵'],
			'2022-02-24': ['🚶', '🏃‍♀️'],
			'2022-02-25': ['🤸', '💪'],
			'2022-02-26': ['🌴', '🦵'],
		};
		const result = getThisWeekData(log);
		expect(result.badges).toEqual(['🏅', '🏆']);
	});

	it('should handle week boundary correctly', () => {
		// Test with date on Monday
		jest.useFakeTimers({ now: new Date('2022-02-21T00:00:00') });
		const log: ExerciseLog = {
			'2022-02-21': ['🚶'], // Monday (this week)
			'2022-02-20': ['🏃‍♀️'], // Sunday (last week)
		};
		const result = getThisWeekData(log);
		expect(result.days['2022-02-21']).toEqual(['🚶']);
		expect(result.days['2022-02-20']).toBeUndefined();
		jest.useFakeTimers({ now: new Date('2022-02-26T00:00:00') }); // Reset
	});

	it('should include all 7 days of the week', () => {
		const log: ExerciseLog = {};
		const result = getThisWeekData(log);
		const dates = Object.keys(result.days).sort();
		expect(dates.length).toBe(7);
		// All dates should be consecutive
		for (let i = 1; i < dates.length; i++) {
			const prev = new Date(dates[i - 1]);
			const curr = new Date(dates[i]);
			prev.setDate(prev.getDate() + 1);
			expect(prev.getTime()).toBe(curr.getTime());
		}
	});
});
