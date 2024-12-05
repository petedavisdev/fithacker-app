import { View, Text, Modal, Pressable } from 'react-native';
import React from 'react';
import { AButton } from '../Atoms/AButton';

type HelpProps = {
	isOpen: boolean;
	onClose: () => void;
};

export function Help(props: HelpProps) {
	const dot = (
		<View className="w-4 h-4 bg-pink-500 rounded-full shadow border-2 border-black" />
	);

	const checkboxExample = (
		<View className="w-12 h-12 justify-center items-center rounded-lg border-2 bg-black relative border-cyan-500 shadow shadow-cyan-700">
			<Text className="text-cyan-400">3</Text>
			<View className="absolute -top-1 -right-1">{dot}</View>
		</View>
	);

	return (
		<Modal animationType="slide" transparent={true} visible={props.isOpen}>
			<View className="flex-1 flex p-2 bg-[#000c]">
				<Pressable onPress={props.onClose} className="flex-1" />

				<View className="flex gap-10 items-center bg-[#112] p-10 rounded-3xl">
					<View className="flex-row items-center gap-5">
						<Text className="text-3xl" />
						{checkboxExample}
						<Text className="text-yellow-500 text-3xl">?</Text>
					</View>

					<View className="flex items-start gap-5">
						<View className="flex-row items-center">
							{dot}
							<Text className="text-pink-400"> = Suggestion</Text>
						</View>

						<Text className="text-pink-400">
							You get two suggestions each day.
						</Text>

						<Text className="text-pink-400">
							Complete what you can today, then look at tomorrow's
							suggestions.
						</Text>

						<Text className="text-cyan-400">
							3 = Days since exercise
						</Text>
					</View>

					<AButton onPress={props.onClose}>👍</AButton>
				</View>
			</View>
		</Modal>
	);
}
