import { Text, TextInput, View, Pressable } from 'react-native';
import { type Exercise } from '@/shared/utils/constants';
import { useTranslation } from 'react-i18next';
import { useState, useRef } from 'react';
import { LIMITS } from '@/shared/utils/constants';
import { useMutateDayExercise } from '@/features/Checklist/useMutateDayExercise';

type NotesItemProps = {
	exercise: Exercise;
	note?: string;
	date: string;
};

export function NotesItem(props: NotesItemProps) {
	const { t } = useTranslation();
	const { mutateDayExercise } = useMutateDayExercise(props.date);
	const [note, setNote] = useState(props.note);
	const [placeholder, setPlaceholder] = useState(t(props.exercise));
	const inputRef = useRef<TextInput>(null);

	function handleFocusInput() {
		inputRef.current?.focus();
	}

	function handleBlur() {
		setPlaceholder(t(props.exercise));
		mutateDayExercise({ exercise: props.exercise, note });
	}

	return (
		<View className="w-full flex-row items-center gap-4 rounded-lg">
			<Pressable onPress={handleFocusInput}>
				<Text className="text-2xl">{props.exercise}</Text>
			</Pressable>

		<TextInput
			ref={inputRef}
			placeholder={placeholder}
			placeholderTextColor={'#64748b'}
			className="text-yellow-400 font-mono border-y-2 border-b-transparent border-t-transparent flex-1 pt-4 pb-4 focus:text-pink-400 focus:border-b-pink-500 outline-none"
			defaultValue={props.note}
			onChangeText={(value) => setNote(value || undefined)}
			onFocus={() => setPlaceholder('')}
			onBlur={handleBlur}
			maxLength={LIMITS.NOTE_MAX_LENGTH}
		/>
		</View>
	);
}

