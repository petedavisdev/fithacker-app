import { Keyboard, Pressable, TextInput, View } from 'react-native';
import { AText } from '@/shared/components/AText';
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
								? 'border-yellow-500 bg-bg'
								: 'border-cyan-500'
					}`}
					style={
						!props.isDisabled
							? {
									shadowColor: props.isChecked ? '#a16207' : '#0e7490',
									shadowOffset: { width: 0, height: 2 },
									shadowOpacity: 0.25,
									shadowRadius: 3.84,
									elevation: 5,
								}
							: undefined
					}
				>
					{props.isChecked ? (
						<AText>👍</AText>
					) : (
						<AText color={props.isDisabled ? 'slate' : 'cyan'} size="lg">
							{props.dayCount}
						</AText>
					)}

					{props.isPriority && !props.isChecked && (
						<View
							className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full border-2 border-black"
							style={{
								shadowColor: '#ec4899',
								shadowOffset: { width: 0, height: 1 },
								shadowOpacity: 0.3,
								shadowRadius: 2,
								elevation: 3,
							}}
						/>
					)}
				</View>

				<AText size="4xl">{props.exercise}</AText>

				{!props.isChecked && (
					<AText color={props.isDisabled ? 'slate' : 'cyan'}>
						{t(props.exercise)}
					</AText>
				)}
			</Pressable>

			{props.isChecked && (
				<TextInput
					placeholder={placeholder}
					placeholderTextColor={'#64748b'}
					className="font-sans text-yellow-400 border-y-2 border-b-yellow-500 border-t-transparent w-64 pt-4 pb-4  focus:text-pink-400 focus:border-b-pink-500 outline-none"
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
