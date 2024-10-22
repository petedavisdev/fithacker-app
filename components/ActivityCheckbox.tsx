import { Pressable, Text, TextInput, View } from 'react-native';
import { type Activity } from '@/constants/ACTIVITIES';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

type ActivityCheckboxProps = {
	activity: Activity;
	isChecked: boolean;
	dayCount?: number;
	note?: string;
	onCheckboxChange: (note?: string) => void;
	onNoteChange: (note?: string) => void;
};

export function ActivityCheckbox(props: ActivityCheckboxProps) {
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
			onPress={() => props.onCheckboxChange(note)}
		>
			<View
				className={`w-12 h-12 justify-center items-center rounded-lg border-2  ${
					props.isChecked
						? 'border-yellow-500 shadow shadow-yellow-500'
						: Number(props.dayCount) < 4
						? 'border-cyan-500 shadow shadow-cyan-500'
						: 'border-pink-500 shadow shadow-pink-500'
				}`}
			>
				{props.isChecked ? (
					<Text>👍</Text>
				) : (
					<Text
						className={`font-mono text-lg ${
							Number(props.dayCount) < 4
								? 'text-cyan-400'
								: 'text-pink-400'
						}`}
					>
						{props.dayCount}
					</Text>
				)}
			</View>

			<Text className="text-4xl">{props.activity}</Text>

			{props.isChecked ? (
				<TextInput
					placeholder={placeholder}
					placeholderTextColor={'slategray'}
					className="text-yellow-400 font-mono border-y-2 border-b-yellow-500 border-t-transparent w-64 py-3 focus:border-yellow-200"
					defaultValue={props.note}
					onChangeText={(value) => setNote(value)}
					onFocus={() => setPlaceholder('')}
					onBlur={() => setPlaceholder(t(props.activity))}
					maxLength={60}
				/>
			) : (
				<Text className="text-cyan-400 font-mono">
					{t(props.activity)}
				</Text>
			)}
		</Pressable>
	);
}
