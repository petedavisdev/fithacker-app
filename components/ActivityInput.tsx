import { Pressable, Text, TextInput, View } from 'react-native';
import { type Activity } from '@/constants/ACTIVITIES';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

type ActivityInputProps = {
	activity: Activity;
	isChecked: boolean;
	dayCount?: number;
	isPriority?: boolean;
	isDisabled?: boolean;
	note?: string;
	onCheckboxChange: (note?: string) => void;
	onNoteChange: (note?: string) => void;
};

export function ActivityInput(props: ActivityInputProps) {
	const { t } = useTranslation();
	const [note, setNote] = useState(props.note);
	const [placeholder, setPlaceholder] = useState(t(props.activity));

	useEffect(() => {
		const debounceTimeoutId = setTimeout(() => {
			props.onNoteChange(note);
		}, 500);
		return () => clearTimeout(debounceTimeoutId);
	}, [note, 500]);

	return (
		<Pressable
			className="w-full flex-row items-center gap-4 rounded-lg"
			onPress={() => props.isDisabled || props.onCheckboxChange(note)}
		>
			<View
				className={`w-12 h-12 justify-center items-center rounded-lg border-2 bg-black relative  ${
					props.isDisabled
						? 'border-transparent'
						: props.isChecked
						? 'border-yellow-500 shadow shadow-yellow-700'
						: 'border-cyan-500 shadow shadow-cyan-700'
				}`}
			>
				{props.isChecked ? (
					<Text>👍</Text>
				) : (
					<Text
						className={`font-mono text-lg ${
							props.isDisabled
								? 'text-slate-400'
								: 'text-cyan-400'
						}`}
					>
						{props.dayCount}
					</Text>
				)}

				{props.isPriority && !props.isChecked && (
					<View className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full shadow border-2 border-black" />
				)}
			</View>

			<Text className="text-4xl">{props.activity}</Text>

			{props.isChecked ? (
				<TextInput
					placeholder={placeholder}
					placeholderTextColor={'slategray'}
					className="text-yellow-400 font-mono border-y-2 border-b-yellow-500 border-t-transparent w-64 py-3 focus:border-yellow-200 focus:text-pink-400 focus:border-b-pink-500"
					defaultValue={props.note}
					onChangeText={(value) => setNote(value)}
					onFocus={() => setPlaceholder('')}
					onBlur={() => setPlaceholder(t(props.activity))}
					maxLength={60}
				/>
			) : (
				<Text
					className={`font-mono ${
						props.isDisabled ? 'text-slate-400' : 'text-cyan-400'
					}`}
				>
					{t(props.activity)}
				</Text>
			)}
		</Pressable>
	);
}
