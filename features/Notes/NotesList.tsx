import { View, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AText } from '@/shared/components/AText';
import type { NotesDay } from './getNotesData';
import { NotesItem } from './NotesItem';
import type { Exercise } from '@/shared/utils/constants';
import { URL_PARAMS } from '@/shared/utils/constants';

type NotesListProps = {
	data: NotesDay[];
	searchQuery?: string;
	filterExercise?: Exercise;
};

export function NotesList(props: NotesListProps) {
	const { t } = useTranslation();
	const router = useRouter();
	const { searchQuery, filterExercise, data } = props;

	if (data.length === 0) {
		const hasFilter = !!filterExercise;
		const hasSearch = !!searchQuery;
		let message: string;
		if (hasFilter && hasSearch) {
			message = t('_notes.noNotesFoundWithFilter', {
				filter: filterExercise,
				searchTerm: searchQuery,
			});
		} else if (hasSearch) {
			message = t('_notes.noNotesFoundWithoutFilter', {
				searchTerm: searchQuery,
			});
		} else if (hasFilter) {
			message = t('_notes.noNotesFoundFilterOnly', { filter: filterExercise });
		} else {
			message = t('_notes.noResultsFound');
		}

		function handleClear() {
			const params: Record<string, string | undefined> = {};
			if (hasSearch) {
				params[URL_PARAMS.SEARCH] = undefined;
			}
			if (hasFilter) {
				params[URL_PARAMS.FILTER] = undefined;
			}
			router.setParams(params);
		}

		return (
			<View className="flex-1 items-center justify-center p-8 gap-4">
				<AText className="text-center">{message}</AText>
				{(hasSearch || hasFilter) && (
					<Pressable onPress={handleClear}>
						<View
							className="px-4 py-2 items-center justify-center border-2 border-pink-500 rounded-full"
							style={{
								shadowColor: '#ec4899',
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.25,
								shadowRadius: 3.84,
								elevation: 5,
							}}
						>
							<AText
								color="pink"
								size="sm"
								className="text-balance text-center"
							>
								{hasSearch && hasFilter
									? t('_notes.clearSearchAndFilter')
									: hasSearch
										? t('_notes.clearSearch')
										: t('_notes.clearFilter')}
							</AText>
						</View>
					</Pressable>
				)}
			</View>
		);
	}

	return (
		<View>
			{props.data.map((day) => (
				<View key={day.date} className="py-2">
					<View className="flex-row items-center">
						<Link href={`/?date=${day.date}`} asChild>
							<Pressable>
								<View className="flex items-start justify-center border-2 bg-bg rounded-full border-cyan-600 px-4 py-2">
									<AText size="xs">{t(day.dateText)}</AText>
								</View>
							</Pressable>
						</Link>
					</View>
					{day.exercises.map((exercise, index) => (
						<NotesItem
							key={`${day.date}-${exercise.exercise}-${index}`}
							exercise={exercise.exercise}
							note={exercise.note}
							date={day.date}
						/>
					))}
				</View>
			))}
		</View>
	);
}
