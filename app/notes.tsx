import { View } from 'react-native';
import { TheHeader } from '@/features/TheHeader/TheHeader';
import { SearchInput } from '@/features/Notes/SearchInput';
import { NotesList } from '@/features/Notes/NotesList';
import { TheFilter } from '@/shared/components/TheFilter';
import { useExerciseLog } from '@/shared/queries/useExerciseLog';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { getNotesData } from '@/features/Notes/getNotesData';
import { type Exercise, URL_PARAMS } from '@/shared/utils/constants';
import { useRef, useEffect } from 'react';
import { useBackgroundSync } from '@/shared/queries/useBackgroundSync';
import { usePendingSync } from '@/shared/queries/usePendingSync';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function NotesScreen() {
	const params = useLocalSearchParams<{
		[URL_PARAMS.SEARCH]?: string;
		[URL_PARAMS.FILTER]?: string;
	}>();
	const { exerciseLog } = useExerciseLog();
	const searchQuery = params[URL_PARAMS.SEARCH];
	const filterExercise = params[URL_PARAMS.FILTER] as Exercise | undefined;

	const { triggerSync } = useBackgroundSync();
	const { pendingSync } = usePendingSync();
	const hasTriggeredSyncRef = useRef(false);
	const pendingSyncRef = useRef<Record<string, string>>({});

	// Keep ref updated with latest pendingSync value
	useEffect(() => {
		pendingSyncRef.current = pendingSync ?? {};
	}, [pendingSync]);

	// Trigger sync when leaving the notes page, but only if there are pending changes
	useFocusEffect(() => {
		// Reset the ref when the screen comes into focus
		hasTriggeredSyncRef.current = false;

		return () => {
			// Check the latest pendingSync value from ref (avoids stale closure)
			const hasPendingChanges =
				Object.keys(pendingSyncRef.current ?? {}).length > 0;
			if (hasPendingChanges && !hasTriggeredSyncRef.current) {
				hasTriggeredSyncRef.current = true;
				triggerSync();
			}
		};
	});

	const notesResults = getNotesData(exerciseLog, searchQuery, filterExercise);

	return (
		<View className="flex-1 items-center">
			<TheHeader buttonLeft="account" buttonRight="chart" />

			<View className="w-96 pt-4 mb-4">
				<SearchInput />
			</View>

			<KeyboardAwareScrollView keyboardOpeningTime={0} className="flex-1 w-96">
				<NotesList
					data={notesResults}
					searchQuery={searchQuery}
					filterExercise={filterExercise}
				/>
			</KeyboardAwareScrollView>

			<View className="w-96 pb-4 pt-4">
				<TheFilter />
			</View>
		</View>
	);
}
