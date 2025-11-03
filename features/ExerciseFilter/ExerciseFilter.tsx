import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
	EXERCISE_CODES,
	type ExerciseCode,
	EXERCISE_METADATA,
	type ExerciseLog,
} from '../EXERCISES';
import { useExerciseLog } from '../useExerciseLog';
import { filterExerciseLog } from './filterExerciseLog';
import { useLocalSearchParams, useRouter } from 'expo-router';

type ExerciseFilterProps = {
	componentToFilter: (props: { exerciseLog: ExerciseLog }) => JSX.Element;
};

export function ExerciseFilter(props: ExerciseFilterProps) {
	const { componentToFilter: ComponentToFilter } = props;

	const params = useLocalSearchParams<{ filter?: ExerciseCode }>();
	const { setParams } = useRouter();

	const [filter, setFilter] = useState<ExerciseCode | undefined>(params.filter);
	const { exerciseLog } = useExerciseLog();
	const filteredExerciseLog = filterExerciseLog(exerciseLog, filter);

	function updateFilter(exercise?: ExerciseCode) {
		setFilter(exercise);
		setParams({ filter: exercise ?? '' });
	}

	return (
		<>
			<ComponentToFilter exerciseLog={filteredExerciseLog} />

			<View className="flex-row justify-center items-center">
				<Pressable onPress={() => updateFilter()}>
					<View
						className={`h-0.5 w-14 ${
							!filter ? ' bg-pink-500 shadow shadow-pink-500' : 'bg-slate-800'
						}`}
					/>
					<Text className="text-cyan-500 w-14 h-12 text-center text-xs font-mono my-3">
						{EXERCISE_CODES.map((code) => (
							<Text key={code}>{EXERCISE_METADATA[code].emoji}</Text>
						))}
					</Text>
				</Pressable>
				{EXERCISE_CODES.map((code) => (
					<Pressable key={code} onPress={() => updateFilter(code)}>
						<View
							className={`h-[2px] w-14 shadow-none ${
								filter === code
									? ' bg-pink-500 shadow-bg shadow-pink-500'
									: 'bg-slate-800'
							}`}
						/>
						<Text className="text-yellow-500 w-14 h-12 text-center text-3xl font-mono my-3">
							{EXERCISE_METADATA[code].emoji}
						</Text>
					</Pressable>
				))}
			</View>
		</>
	);
}