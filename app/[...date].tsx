import { Text, View } from 'react-native';
import { ActivityCheckbox } from '@/components/ActivityCheckbox';
import { useState } from 'react';
import { ACTIVITIES, ActivityDay } from '@/constants/ACTIVITIES';
import { useTranslation } from 'react-i18next';
import { Link, useLocalSearchParams } from 'expo-router';

export default function HomeScreen() {
	const { t } = useTranslation();

	const { date } = useLocalSearchParams();

	const [dayActivities, setDayActivities] = useState<ActivityDay>([]);

	return (
		<>
			<Text className="w-96 text-cyan-300 text-2xl font-semibold text-center text-balance">
				{t(getDateText(date))}
			</Text>

			<View className="w-96 flex gap-2">
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

			<Link href="/chart">
				<View className="w-20 h-20 flex items-center justify-center border border-yellow-500 rounded-full">
					<Text className="text-4xl">👉</Text>
				</View>
			</Link>
		</>
	);
}

function getDateText(date?: string | string[]) {
	// Today
	const today = new Date().toISOString().slice(0, 10);
	date = date && Date.parse(date.toString()) ? date : today; // if not a valid date, use today
	if (date === today) return '_.today';

	// Yesterday
	const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
		.toISOString()
		.slice(0, 10);
	if (date === yesterday) return '_.yesterday';

	// This week
	const lastMonday =
		new Date().getDay() === 1
			? new Date().toISOString().slice(0, 10)
			: new Date(
					new Date().setDate(
						new Date().getDate() -
							new Date().getDay() +
							(new Date().getDay() === 0 ? -6 : 1)
					)
			  )
					.toISOString()
					.slice(0, 10);
	if (date >= lastMonday)
		return new Date(date).toLocaleDateString(undefined, {
			weekday: 'long',
		});

	// This year
	const isCurrentYear = date.slice(0, 4) === today.slice(0, 4);
	if (isCurrentYear)
		return new Date(date).toLocaleDateString(undefined, {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
		});

	// Other years
	return new Date(date).toLocaleDateString(undefined, {
		dateStyle: 'full',
	});
}
