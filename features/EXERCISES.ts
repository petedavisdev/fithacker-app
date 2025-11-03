export const EXERCISE_METADATA = {
	a: { emoji: '🚶', priority: 2 },
	b: { emoji: '🏃‍♀️', priority: 0.5 },
	c: { emoji: '🤸', priority: 0.7 },
	d: { emoji: '💪', priority: 0.1 },
	e: { emoji: '🌴', priority: 0.3 },
	f: { emoji: '🦵', priority: 0.9 },
} as const;

export type ExerciseCode = keyof typeof EXERCISE_METADATA;
export const EXERCISE_CODES = Object.keys(EXERCISE_METADATA) as ExerciseCode[];

export type ExerciseDay = Partial<Record<ExerciseCode, string>>;
export type ExerciseLog = Record<string, ExerciseDay | undefined>;