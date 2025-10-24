import { Modal, Pressable, View } from 'react-native';

import { AButton } from './AButton';
import React from 'react';

type AModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
};

export function AModal(props: AModalProps) {
	return (
		<Modal animationType="slide" transparent={true} visible={props.isOpen}>
			<View className="flex-1 flex px-2 pb-8 bg-[#000c]">
				<Pressable onPress={props.onClose} className="flex-1" />

				<View className="flex gap-10 items-center bg-bg p-10 rounded-3xl">
					{props.children}

					<AButton onPress={props.onClose}>👍</AButton>
				</View>
			</View>
		</Modal>
	);
}
