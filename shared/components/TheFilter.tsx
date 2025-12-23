import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EXERCISES, type Exercise, URL_PARAMS } from '@/shared/utils/constants';

export function TheFilter() {
	const params = useLocalSearchParams<{ [URL_PARAMS.FILTER]?: string }>();
	const router = useRouter();
	const filter = params[URL_PARAMS.FILTER] as Exercise | undefined;
	const isValidFilter = Boolean(filter);

	function updateFilter(exercise?: Exercise) {
		if (exercise) {
			router.setParams({ [URL_PARAMS.FILTER]: exercise });
		} else {
			router.setParams({ [URL_PARAMS.FILTER]: undefined });
		}
	}

	return (
		<View className="flex-row justify-center items-center">
			<Pressable onPress={() => updateFilter()}>
				<View
					className={`h-0.5 w-14 ${
						!isValidFilter
							? ' bg-pink-500 shadow shadow-pink-500'
							: 'bg-slate-800'
					}`}
				/>
				<Text className="text-cyan-500 w-14 h-12 text-center text-xs font-mono my-3">
					{EXERCISES.map((exercise) => (
						<Text key={exercise}>{exercise}</Text>
					))}
				</Text>
			</Pressable>
			{Object.values(EXERCISES).map((exercise) => (
				<Pressable key={exercise} onPress={() => updateFilter(exercise)}>
					<View
						className={`h-[2px] w-14 shadow-none ${
							filter === exercise
								? ' bg-pink-500 shadow-bg shadow-pink-500'
								: 'bg-slate-800'
						}`}
					/>
					<Text className="text-yellow-500 w-14 h-12 text-center text-3xl font-mono my-3">
						{exercise}
					</Text>
				</Pressable>
			))}
		</View>
	);
}

