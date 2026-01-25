import {
	convertExerciseLogToCsv,
	formatExerciseLogAsJson,
} from './convertExerciseLog';
import type { ExerciseLog } from '@/shared/utils/constants';

describe('convertExerciseLogToCsv', () => {
	it('handles empty log', () => {
		const log: ExerciseLog = {};
		const csv = convertExerciseLogToCsv(log);
		expect(csv).toBe('Date,Exercise,Note');
	});

	it('handles exercises without notes', () => {
		const log: ExerciseLog = {
			'2026-01-15': ['🚶', '💪'],
		};
		const csv = convertExerciseLogToCsv(log);
		expect(csv).toBe('Date,Exercise,Note\n2026-01-15,🚶,\n2026-01-15,💪,');
	});

	it('handles exercises with notes', () => {
		const log: ExerciseLog = {
			'2026-01-15': [['💪', 'morning workout']],
		};
		const csv = convertExerciseLogToCsv(log);
		expect(csv).toBe('Date,Exercise,Note\n2026-01-15,💪,morning workout');
	});

	it('handles notes with commas', () => {
		const log: ExerciseLog = {
			'2026-01-15': [['🌴', 'long note with, commas']],
		};
		const csv = convertExerciseLogToCsv(log);
		expect(csv).toBe(
			'Date,Exercise,Note\n2026-01-15,🌴,"long note with, commas"',
		);
	});

	it('handles notes with quotes', () => {
		const log: ExerciseLog = {
			'2026-01-15': [['💪', 'note with "quotes"']],
		};
		const csv = convertExerciseLogToCsv(log);
		expect(csv).toBe(
			'Date,Exercise,Note\n2026-01-15,💪,"note with ""quotes"""',
		);
	});

	it('handles notes with newlines', () => {
		const log: ExerciseLog = {
			'2026-01-15': [['💪', 'note with\nnewline']],
		};
		const csv = convertExerciseLogToCsv(log);
		expect(csv).toBe('Date,Exercise,Note\n2026-01-15,💪,"note with\nnewline"');
	});

	it('handles multiple exercises per day', () => {
		const log: ExerciseLog = {
			'2026-01-15': ['🚶', ['💪', 'morning workout'], '🏃‍♀️'],
		};
		const csv = convertExerciseLogToCsv(log);
		expect(csv).toBe(
			'Date,Exercise,Note\n2026-01-15,🚶,\n2026-01-15,💪,morning workout\n2026-01-15,🏃‍♀️,',
		);
	});

	it('sorts dates chronologically', () => {
		const log: ExerciseLog = {
			'2026-01-16': ['🚶'],
			'2026-01-15': ['💪'],
			'2026-01-17': ['🏃‍♀️'],
		};
		const csv = convertExerciseLogToCsv(log);
		const lines = csv.split('\n');
		expect(lines[1]).toBe('2026-01-15,💪,');
		expect(lines[2]).toBe('2026-01-16,🚶,');
		expect(lines[3]).toBe('2026-01-17,🏃‍♀️,');
	});

	it('handles mixed exercises with and without notes', () => {
		const log: ExerciseLog = {
			'2026-01-15': [
				'🚶',
				['💪', 'morning workout'],
				'🏃‍♀️',
				['🌴', 'core session'],
			],
		};
		const csv = convertExerciseLogToCsv(log);
		expect(csv).toBe(
			'Date,Exercise,Note\n2026-01-15,🚶,\n2026-01-15,💪,morning workout\n2026-01-15,🏃‍♀️,\n2026-01-15,🌴,core session',
		);
	});
});

describe('formatExerciseLogAsJson', () => {
	it('formats empty log', () => {
		const log: ExerciseLog = {};
		const json = formatExerciseLogAsJson(log);
		expect(json).toBe('{}');
	});

	it('formats log with data', () => {
		const log: ExerciseLog = {
			'2026-01-15': ['🚶', ['💪', 'morning workout']],
		};
		const json = formatExerciseLogAsJson(log);
		const parsed = JSON.parse(json);
		expect(parsed).toEqual(log);
		expect(json).toContain('2026-01-15');
		expect(json).toContain('🚶');
		expect(json).toContain('morning workout');
	});
});
