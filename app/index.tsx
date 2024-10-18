import { Pressable, Text, View } from 'react-native';
import { ActivityCheckbox } from '@/components/ActivityCheckbox';
import { useState } from 'react';
import { ACTIVITIES, ActivityDay } from '@/constants/ACTIVITIES';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
	const { t } = useTranslation();
	const [dayActivities, setDayActivities] = useState<ActivityDay>([]);

	return (
		<View className="flex-1 flex items-center justify-center gap-10 bg-slate-950">
			<Text className="text-blue-300 text-xl font-semibold">
				{t('_.whatExerciseToday')}
			</Text>

			<View className="w-80 flex gap-2">
				{ACTIVITIES.map((activity) => (
					<ActivityCheckbox
						key={activity}
						activity={activity}
						isChecked={dayActivities.flat().includes(activity)}
						onChange={(note?: string) =>
							setDayActivities((prev) =>
								prev.flat().includes(activity)
									? prev.filter(
											(item) => item[0] !== activity
									  )
									: [
											...prev,
											note ? [activity, note] : activity,
									  ]
							)
						}
					/>
				))}
			</View>

			<Pressable className="w-16 h-16 bg-blue-950 flex items-center justify-center border border-blue-600 rounded-full">
				<Text className="text-blue-300 font-mono text-3xl">👍</Text>
			</Pressable>
		</View>
	);
}
