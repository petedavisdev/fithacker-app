import { Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AEmoji } from '@/shared/components/AEmoji';
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
					className={`h-0.5 w-14 ${!isValidFilter ? ' bg-pink-500' : 'bg-slate-800'}`}
					style={
						!isValidFilter
							? {
									shadowColor: '#ec4899',
									shadowOffset: { width: 0, height: 1 },
									shadowOpacity: 0.3,
									shadowRadius: 2,
									elevation: 3,
								}
							: undefined
					}
				/>
				<View className="w-14 h-12 flex-row flex-wrap justify-center content-start my-3">
					{EXERCISES.map((exercise) => (
						<AEmoji key={exercise} size="xs">
							{exercise}
						</AEmoji>
					))}
				</View>
			</Pressable>
			{Object.values(EXERCISES).map((exercise) => (
				<Pressable key={exercise} onPress={() => updateFilter(exercise)}>
					<View
						className={`h-[2px] w-14 ${filter === exercise ? ' bg-pink-500' : 'bg-slate-800'}`}
						style={
							filter === exercise
								? {
										shadowColor: '#ec4899',
										shadowOffset: { width: 0, height: 1 },
										shadowOpacity: 0.3,
										shadowRadius: 2,
										elevation: 3,
									}
								: undefined
						}
					/>
					<AEmoji size="3xl" className="w-14 h-12 text-center my-3">
						{exercise}
					</AEmoji>
				</Pressable>
			))}
		</View>
	);
}
