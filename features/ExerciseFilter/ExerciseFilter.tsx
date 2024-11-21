import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { EXERCISES, type Exercise, type ExerciseLog } from '../EXERCISES';
import { useExerciseLog } from '../useExerciseLog';
import { filterExerciseLog } from './filterExerciseLog';
import { useLocalSearchParams, useRouter } from 'expo-router';

type ExerciseFilterProps = {
	componentToFilter: (props: { exerciseLog: ExerciseLog }) => JSX.Element;
};

export function ExerciseFilter(props: ExerciseFilterProps) {
	const { componentToFilter: ComponentToFilter } = props;

	const params = useLocalSearchParams<{ filter?: Exercise }>();
	const { setParams } = useRouter();

	const [filter, setFilter] = useState<Exercise | undefined>(params.filter);
	const { exerciseLog } = useExerciseLog();
	const filteredExerciseLog = filterExerciseLog(exerciseLog, filter);

	function updateFilter(exercise?: Exercise) {
		setFilter(exercise);
		setParams({ filter: exercise ?? '' });
	}

	return (
		<>
			<ComponentToFilter exerciseLog={filteredExerciseLog} />

			<View className="flex-row justify-center items-center gap-1">
				<Pressable onPress={() => updateFilter()}>
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
						onPress={() => updateFilter(exercise)}
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
