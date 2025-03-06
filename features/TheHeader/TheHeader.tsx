import { Text, View } from 'react-native';

import { AButton } from '../Atoms/AButton';
import { AModal } from '../Atoms/AModal';
import { HelpSuggestions } from './HelpSuggestions';
import { Link } from 'expo-router';
import React from 'react';
import { User } from '../User/User';

const headerButtons = {
	account: <></>,
	help: <></>,
};

type TheHeaderButtons = keyof typeof headerButtons;

type TheHeaderProps = {
	buttonLeft?: TheHeaderButtons;
	buttonRight?: TheHeaderButtons;
};

export function TheHeader(props: TheHeaderProps) {
	const [isAccountOpen, setIsAccountOpen] = React.useState(false);

	headerButtons.account = (
		<AButton onPress={() => setIsAccountOpen(true)} size="sm">
			👋
		</AButton>
	);

	const [isHelpOpen, setIsHelpOpen] = React.useState(false);

	function closeHelp() {
		setIsHelpOpen(false);
	}

	headerButtons.help = (
		<AButton onPress={() => setIsHelpOpen(true)} color="pink" size="sm">
			?
		</AButton>
	);

	return (
		<View className="w-full flex-row justify-center p-4">
			<View className="w-full flex-row justify-between">
				<View className="h-10 w-10">
					{props.buttonLeft && headerButtons[props.buttonLeft]}
				</View>

				<Link href="/" className="flex-row">
					<Text className="font-mono text-xl text-yellow-500">
						FIT
					</Text>
					<Text className="font-mono text-xl text-cyan-500">
						HACKER
					</Text>
				</Link>

				<View className="h-10 w-10">
					{props.buttonRight && headerButtons[props.buttonRight]}
				</View>
			</View>

			<AModal
				isOpen={isAccountOpen}
				onClose={() => setIsAccountOpen(false)}
			>
				<User />
			</AModal>

			<AModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)}>
				<HelpSuggestions />
			</AModal>
		</View>
	);
}
