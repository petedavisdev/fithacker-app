import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ExerciseChart } from '../components/ExerciseChart';
import { EXERCISES, type Exercise } from '../constants/EXERCISES';

export default function chart() {
	const [filter, setFilter] = useState<Exercise>();

	return (
		<>
			<ExerciseChart filter={filter} weekCount={2} />

			<View className="flex-row justify-center items-center gap-1">
				<Pressable onPress={() => setFilter(undefined)}>
					<View
						className={`h-0.5 w-14 ${
							!filter
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
					<Pressable
						key={exercise}
						onPress={() => setFilter(exercise)}
					>
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
		</>
	);
}
