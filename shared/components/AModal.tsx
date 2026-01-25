import { Modal, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AButton } from './AButton';
import { AText } from './AText';
import React from 'react';

type AModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm?: () => void;
	children?: React.ReactNode;
	showDefaultButton?: boolean;
	showCancel?: boolean;
};

export function AModal(props: AModalProps) {
	const { t } = useTranslation();
	const showButton = props.showDefaultButton ?? true;
	// Use onConfirm if provided, otherwise fall back to onClose
	const handleConfirm = props.onConfirm || props.onClose;

	return (
		<Modal animationType="slide" transparent={true} visible={props.isOpen}>
			<View className="flex-1 flex px-2 pb-8 bg-[#000c]">
				<Pressable onPress={props.onClose} className="flex-1" />

				<View className="flex gap-10 items-center bg-bg p-10 rounded-3xl">
					{props.children}

					{showButton && (
						<View className="gap-3 items-center">
							<AButton onPress={handleConfirm}>👍</AButton>
							{props.showCancel && (
								<Pressable onPress={props.onClose}>
									<AText className="underline">{t('_account.cancel')}</AText>
								</Pressable>
							)}
						</View>
					)}
				</View>
			</View>
		</Modal>
	);
}
