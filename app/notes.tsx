import {
	View,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	InteractionManager,
	Keyboard,
} from 'react-native';
import { TheHeader } from '@/shared/components/TheHeader';
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
	const scrollViewRef = useRef<ScrollView>(null);
	const shouldScrollRef = useRef(true);

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

	// Reset scroll flag when search or filter changes
	useEffect(() => {
		shouldScrollRef.current = true;
	}, [searchQuery, filterExercise]);

	// Explicitly scroll to end when search/filter changes (onContentSizeChange may not fire if content height is unchanged)
	useEffect(() => {
		const task = InteractionManager.runAfterInteractions(() => {
			if (scrollViewRef.current) {
				scrollViewRef.current.scrollToEnd({ animated: false });
			}
		});
		return () => task.cancel();
	}, [searchQuery, filterExercise]);

	function handleContentSizeChange(_width: number, height: number) {
		if (shouldScrollRef.current && scrollViewRef.current) {
			scrollViewRef.current.scrollToEnd({ animated: false });
			shouldScrollRef.current = false;
		}
	}

	// Scroll to end when keyboard closes (plain ScrollView has no onKeyboardDidHide)
	useEffect(() => {
		const subscription = Keyboard.addListener('keyboardDidHide', () => {
			InteractionManager.runAfterInteractions(() => {
				if (scrollViewRef.current) {
					scrollViewRef.current.scrollToEnd({ animated: false });
				}
			});
		});
		return () => subscription.remove();
	}, []);

	return (
		<View className="flex-1 items-center">
			<TheHeader buttonLeft="account" buttonRight="chart" />

			<ScrollView
				ref={scrollViewRef}
				className="flex-1 w-96 border-t-2 border-b-2 border-black"
				contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
				onContentSizeChange={handleContentSizeChange}
			>
				<NotesList
					data={notesResults}
					searchQuery={searchQuery}
					filterExercise={filterExercise}
				/>
			</ScrollView>

			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				className="w-96"
			>
				<View className="w-96">
					<SearchInput />
				</View>
				<View className="w-96 pb-4">
					<TheFilter />
				</View>
			</KeyboardAvoidingView>
		</View>
	);
}
