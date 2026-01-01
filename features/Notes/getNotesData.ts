import type { Exercise, ExerciseLog } from '@/shared/utils/constants';
import { getDateInfo } from '@/shared/utils/dateInfo';

export type NotesExercise = {
	exercise: Exercise;
	note?: string;
};

export type NotesDay = {
	date: string;
	dateText: string;
	exercises: NotesExercise[];
};

export function getNotesData(
	exerciseLog: ExerciseLog,
	searchQuery?: string,
	filterExercise?: Exercise,
): NotesDay[] {
	const results: NotesDay[] = [];
	const hasSearchQuery = !!searchQuery;

	// Get all dates, sorted newest first
	const dates = Object.keys(exerciseLog)
		.filter((date) => exerciseLog[date] && exerciseLog[date]!.length > 0)
		.sort((a, b) => b.localeCompare(a));

	for (const date of dates) {
		const day = exerciseLog[date]!;
		const exercises: NotesExercise[] = [];

		for (const item of day) {
			const exercise = Array.isArray(item) ? item[0] : item;
			const note = Array.isArray(item) ? item[1] : undefined;

			// Apply exercise filter independently
			if (filterExercise && exercise !== filterExercise) {
				continue;
			}

			// If searching, only include exercises with notes that match
			if (hasSearchQuery) {
				if (!note) continue;
				const query = searchQuery.toLowerCase();
				if (!note.toLowerCase().includes(query)) {
					continue;
				}
			}

			exercises.push({ exercise, note });
		}

		// Only add day if it has matching exercises
		if (exercises.length > 0) {
			const dateInfo = getDateInfo(date);
			results.push({
				date,
				dateText: dateInfo.text,
				exercises,
			});
		}
	}

	return results;
}
