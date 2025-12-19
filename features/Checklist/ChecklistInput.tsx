import { Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import { type Exercise } from '@/shared/utils/constants';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { LIMITS } from '@/shared/utils/constants';
import { useMutateDayExercise } from './useMutateDayExercise';
import { useLocalSearchParams } from 'expo-router';
import { getDateInfo } from '@/shared/utils/dateInfo';

type ChecklistInputProps = {
	exercise: Exercise;
	isChecked: boolean;
	dayCount?: number;
	isPriority?: boolean;
	isDisabled?: boolean;
	note?: string;
};

export function ChecklistInput(props: ChecklistInputProps) {
	const { t } = useTranslation();
	const { date } = useLocalSearchParams<{ date: string }>();
	const dateInfo = getDateInfo(date?.toString());
	const { mutateDayExercise } = useMutateDayExercise(dateInfo.date);
	const [note, setNote] = useState(props.note);
	const [placeholder, setPlaceholder] = useState(t(props.exercise));

	function handleBlur() {
		setPlaceholder(t(props.exercise));
		if (props.isChecked) {
			mutateDayExercise({ exercise: props.exercise, note });
		}
	}

	return (
		<View className="w-full flex-row items-center gap-4 rounded-lg">
			<Pressable
				className="flex-row items-center gap-4"
				onPress={() => {
					if (props.isDisabled) return;
					Keyboard.dismiss();
					if (props.isChecked) {
						mutateDayExercise({ exercise: props.exercise, remove: true });
					} else {
						mutateDayExercise({ exercise: props.exercise, note });
					}
				}}
			>
				<View
					className={`w-12 h-12 justify-center items-center rounded-lg border-2 bg-black relative  ${
						props.isDisabled
							? 'border-transparent'
							: props.isChecked
								? 'border-yellow-500 shadow shadow-yellow-700 bg-bg'
								: 'border-cyan-500 shadow shadow-cyan-700'
					}`}
				>
					{props.isChecked ? (
						<Text>👍</Text>
					) : (
						<Text
							className={`font-mono text-lg ${
								props.isDisabled ? 'text-slate-400' : 'text-cyan-400'
							}`}
						>
							{props.dayCount}
						</Text>
					)}

					{props.isPriority && !props.isChecked && (
						<View className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full shadow border-2 border-black" />
					)}
				</View>

				<Text className="text-4xl">{props.exercise}</Text>

				{!props.isChecked && (
					<Text
						className={`font-mono ${
							props.isDisabled ? 'text-slate-400' : 'text-cyan-400'
						}`}
					>
						{t(props.exercise)}
					</Text>
				)}
			</Pressable>

			{props.isChecked && (
				<TextInput
					placeholder={placeholder}
					placeholderTextColor={'#64748b'}
					className="text-yellow-400 font-mono border-y-2 border-b-yellow-500 border-t-transparent w-64 py-3  focus:text-pink-400 focus:border-b-pink-500 outline-none"
					defaultValue={props.note}
					onChangeText={(value) => setNote(value || undefined)}
					onFocus={() => setPlaceholder('')}
					onBlur={handleBlur}
					maxLength={LIMITS.NOTE_MAX_LENGTH}
				/>
			)}
		</View>
	);
}
