import { Pressable, Text, TextInput, View } from 'react-native';
import { type Activity } from '@/constants/ACTIVITIES';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

type ActivityCheckboxProps = {
	activity: Activity;
	isChecked: boolean;
	note?: string;
	onCheckboxChange: (note: string) => void;
	onNoteChange: (note: string) => void;
};

export function ActivityCheckbox(props: ActivityCheckboxProps) {
	const { t } = useTranslation();
	const [note, setNote] = useState(props.note ?? '');

	return (
		<Pressable
			className={`w-full flex-row items-center gap-2 p-2 rounded-lg ${
				props.isChecked ? 'bg-slate-900' : ''
			}`}
			onPress={() => props.onCheckboxChange(note)}
		>
			<View
				className={`w-12 h-12 justify-center items-center rounded-md border  ${
					props.isChecked
						? `bg-slate-950 border-yellow-400`
						: ' border-cyan-500'
				}`}
			>
				{props.isChecked ? (
					<Text>👍</Text>
				) : (
					<Text className="text-cyan-400">0</Text>
				)}
			</View>

			<Text className="text-4xl">{props.activity}</Text>

			{props.isChecked ? (
				<TextInput
					placeholder={t(props.activity)}
					placeholderTextColor={'slategray'}
					className="text-yellow-300 font-mono border-b border-yellow-400 w-60 py-3"
					value={note}
					onChangeText={(value) => {
						setNote(value);
						props.onNoteChange(value);
					}}
				/>
			) : (
				<Text className="text-cyan-300 font-mono">
					{t(props.activity)}
				</Text>
			)}
		</Pressable>
	);
}
