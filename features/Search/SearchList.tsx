import { View, Text, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import type { SearchResultDay } from './getSearchData';

type SearchListProps = {
	data: SearchResultDay[];
};

export function SearchList(props: SearchListProps) {
	const { t } = useTranslation();

	if (props.data.length === 0) {
		return (
			<View className="flex-1 items-center justify-center p-8">
				<Text className="text-slate-400 font-mono text-center">
					No results found
				</Text>
			</View>
		);
	}

	return (
		<ScrollView className="flex-1">
			{props.data.map((day) => (
				<View key={day.date} className="py-2">
					<View className="flex-row items-center">
						<Link href={`/?date=${day.date}`} asChild>
							<Pressable>
								<View className="flex items-start justify-center border-2 bg-bg rounded-full border-cyan-600 px-4 py-2">
									<Text className="text-cyan-400 font-mono text-xs">
										{t(day.dateText)}
									</Text>
								</View>
							</Pressable>
						</Link>
					</View>
					{day.exercises.map((exercise, index) => (
						<View key={`${day.date}-${exercise.exercise}-${index}`} className="py-2 flex-row items-center gap-3">
							<Text className="text-2xl">{exercise.exercise}</Text>
							{exercise.note ? (
								<Text className="text-yellow-400 font-mono flex-1">
									{exercise.note}
								</Text>
							) : (
								<Text className="text-cyan-600 font-mono flex-1">
									{t(exercise.exercise)}
								</Text>
							)}
						</View>
					))}
				</View>
			))}
		</ScrollView>
	);
}

