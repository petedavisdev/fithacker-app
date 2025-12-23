import { View } from 'react-native';
import { TheHeader } from '@/features/TheHeader/TheHeader';
import { SearchInput } from '@/features/Search/SearchInput';
import { SearchList } from '@/features/Search/SearchList';
import { TheFilter } from '@/shared/components/TheFilter';
import { useExerciseLog } from '@/shared/queries/useExerciseLog';
import { useLocalSearchParams } from 'expo-router';
import { getSearchData } from '@/features/Search/getSearchData';
import { type Exercise, URL_PARAMS } from '@/shared/utils/constants';

export default function SearchScreen() {
	const params = useLocalSearchParams<{ [URL_PARAMS.SEARCH]?: string; [URL_PARAMS.FILTER]?: string }>();
	const { exerciseLog } = useExerciseLog();
	const searchQuery = params[URL_PARAMS.SEARCH];
	const filterExercise = params[URL_PARAMS.FILTER] as Exercise | undefined;

	const searchResults = getSearchData(exerciseLog, searchQuery, filterExercise);

	return (
		<View className="flex-1 items-center">
			<TheHeader buttonLeft="back" />

			<View className="w-96 pt-4 mb-4">
				<SearchInput />
			</View>

			<View className="flex-1 w-96">
				<SearchList data={searchResults} />
			</View>

			<View className="w-96 pb-4 pt-4">
				<TheFilter />
			</View>
		</View>
	);
}

