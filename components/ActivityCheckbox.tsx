import { Pressable, Text, View } from 'react-native';
import { type Activity } from '@/constants/ACTIVITIES';
import { useTranslation } from 'react-i18next';

type ActivityCheckboxProps = {
	activity: Activity;
	isChecked: boolean;
	onChange: (value: string) => void;
};

export function ActivityCheckbox(props: ActivityCheckboxProps) {
	const { t } = useTranslation();

	return (
		<Pressable
			className={`w-full flex-row items-center gap-2 p-2 rounded-lg ${
				props.isChecked ? 'bg-blue-950' : ''
			}`}
			onPress={() => props.onChange(props.activity)}
		>
			<View
				className={`w-8 h-8 justify-center items-center rounded-full border border-blue-600 ${
					props.isChecked ? `bg-blue-700` : 'bg-blue-950'
				}`}
			>
				{props.isChecked ? (
					<Text>👍</Text>
				) : (
					<Text className="text-blue-400">0</Text>
				)}
			</View>

			<Text className="text-3xl">{props.activity}</Text>

			<Text className="text-blue-300 font-mono">{t(props.activity)}</Text>
		</Pressable>
	);
}
