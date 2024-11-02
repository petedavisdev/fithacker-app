export const EXERCISES = ['🚶', '🏃‍♀️', '🤸', '💪', '🌴', '🦵'] as const;

export type Exercise = (typeof EXERCISES)[number];
export type ExerciseItem = Exercise | [Exercise, string];
export type ExerciseDay = ExerciseItem[];
export type ExerciseLog = Record<string, ExerciseDay | undefined>;

export const EXERCISE_PRIORITIES: Record<Exercise, number> = {
	'🚶': 2,
	'🦵': 0.9,
	'🤸': 0.7,
	'🏃‍♀️': 0.5,
	'🌴': 0.3,
	'💪': 0.1,
};
