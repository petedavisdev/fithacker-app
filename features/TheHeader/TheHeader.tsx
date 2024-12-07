import { View, Text } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { AButton } from '../Atoms/AButton';
import { Help } from './Help';

const headerButtons = {
	account: (
		<AButton href="/account" size="sm">
			👋
		</AButton>
	),
	help: <></>,
};

type TheHeaderButtons = keyof typeof headerButtons;

type TheHeaderProps = {
	buttonLeft?: TheHeaderButtons;
	buttonRight?: TheHeaderButtons;
};

export function TheHeader(props: TheHeaderProps) {
	const [isHelpOpen, setIsHelpOpen] = React.useState(false);

	function open() {
		setIsHelpOpen(true);
	}

	function closeHelp() {
		setIsHelpOpen(false);
	}

	headerButtons.help = (
		<AButton onPress={open} color="pink" size="sm">
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

			<Help isOpen={isHelpOpen} onClose={closeHelp} />
		</View>
	);
}
