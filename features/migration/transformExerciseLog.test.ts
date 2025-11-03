import type { ExerciseLog as OldExerciseLog } from '../EXERCISES.old';
import type { ExerciseLog } from '../EXERCISES';
import { transformExerciseLog } from './transformExerciseLog';

describe('transformExerciseLog', () => {
	describe('Happy paths', () => {
		it('should handle empty log', () => {
			const oldLog: OldExerciseLog = {};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({});
		});

		it('should transform single day with one exercise (no note)', () => {
			const oldLog: OldExerciseLog = {
				'2024-02-17': ['🚶'],
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-02-17': { a: '' },
			});
		});

		it('should transform single day with one exercise (with note)', () => {
			const oldLog: OldExerciseLog = {
				'2024-02-17': [['🚶', '10,000 Chester']],
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-02-17': { a: '10,000 Chester' },
			});
		});

		it('should transform single day with multiple exercises (mixed notes)', () => {
			const oldLog: OldExerciseLog = {
				'2024-02-17': ['🤸', ['🚶', '10,000 Chester'], '💪'],
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-02-17': {
					c: '',
					a: '10,000 Chester',
					d: '',
				},
			});
		});

		it('should transform multiple days with various exercises', () => {
			const oldLog: OldExerciseLog = {
				'2024-02-17': ['🤸', ['🚶', '10,000 Chester']],
				'2024-02-18': ['🚶', '🤸'],
				'2024-02-19': ['🏃‍♀️', '💪'],
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-02-17': {
					c: '',
					a: '10,000 Chester',
				},
				'2024-02-18': {
					a: '',
					c: '',
				},
				'2024-02-19': {
					b: '',
					d: '',
				},
			});
		});

		it('should handle notes with special characters and emojis', () => {
			const oldLog: OldExerciseLog = {
				'2024-02-17': [['🚶', '10,000 Chester 🏃‍♀️!']],
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-02-17': { a: '10,000 Chester 🏃‍♀️!' },
			});
		});
	});

	describe('Edge cases', () => {
		it('should handle empty arrays', () => {
			const oldLog: OldExerciseLog = {
				'2024-01-01': [],
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-01-01': {},
			});
		});

		it('should skip undefined days', () => {
			const oldLog: OldExerciseLog = {
				'2024-01-01': undefined,
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-01-01': {},
			});
		});

		it('should handle duplicate exercises in same day (keep last)', () => {
			const oldLog: OldExerciseLog = {
				'2024-02-17': ['🚶', ['🚶', '10,000 Chester']],
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-02-17': { a: '10,000 Chester' },
			});
		});

		it('should handle very long notes (60+ chars)', () => {
			const longNote = 'A'.repeat(100);
			const oldLog: OldExerciseLog = {
				'2024-02-17': [['🚶', longNote]],
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-02-17': { a: longNote },
			});
		});

		it('should transform notes with only whitespace to empty string', () => {
			const oldLog: OldExerciseLog = {
				'2024-02-17': [['🚶', '   ']],
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-02-17': { a: '   ' },
			});
		});
	});

	describe('Corrupted data scenarios', () => {
		it('should skip unknown emoji silently', () => {
			const oldLog: OldExerciseLog = {
				'2024-02-17': ['🚶', '🔥', '🤸'] as any,
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-02-17': {
					a: '',
					c: '',
				},
			});
		});

		it('should handle invalid array structure (missing note)', () => {
			const oldLog: OldExerciseLog = {
				'2024-02-17': ['🚶', ['🏃‍♀️']] as any,
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-02-17': {
					a: '',
					b: '',
				},
			});
		});

		it('should convert non-string notes to string', () => {
			const oldLog: OldExerciseLog = {
				'2024-02-17': [['🚶', 12345]] as any,
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-02-17': { a: '12345' },
			});
		});

		it('should skip non-array day values', () => {
			const oldLog: OldExerciseLog = {
				'2024-02-17': 'invalid' as any,
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-02-17': {},
			});
		});

		it('should handle malformed tuples (use first two)', () => {
			const oldLog: OldExerciseLog = {
				'2024-02-17': [['🚶', 'note', 'extra']] as any,
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-02-17': { a: 'note' },
			});
		});

		it('should skip null or undefined values in array', () => {
			const oldLog: OldExerciseLog = {
				'2024-02-17': ['🚶', null, undefined, '🤸'] as any,
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-02-17': {
					a: '',
					c: '',
				},
			});
		});

		it('should process valid items and skip invalid ones', () => {
			const oldLog: OldExerciseLog = {
				'2024-02-17': ['🚶', '🔥', ['🤸', 'note'], 'invalid'] as any,
			};
			const result = transformExerciseLog(oldLog);
			expect(result).toEqual({
				'2024-02-17': {
					a: '',
					c: 'note',
				},
			});
		});
	});
});
