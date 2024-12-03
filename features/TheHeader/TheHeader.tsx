import { View, Text } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { AButton } from '../Atoms/AButton';
import { Help } from './Help';

export function TheHeader() {
	const [isHelpOpen, setIsHelpOpen] = React.useState(false);

	function open() {
		setIsHelpOpen(true);
	}

	function closeHelp() {
		setIsHelpOpen(false);
	}

	return (
		<View className="w-full flex-row justify-center p-4">
			<View className="w-96 flex-row justify-between">
				<AButton onPress={open} size="sm">
					?
				</AButton>

				<Link href="/" className="flex-row">
					<Text className="font-mono text-xl text-yellow-500">
						FIT
					</Text>
					<Text className="font-mono text-xl text-cyan-500">
						HACKER
					</Text>
				</Link>

				<AButton href="/account" size="sm" isHidden>
					👋
				</AButton>
			</View>

			<Help isOpen={isHelpOpen} onClose={closeHelp} />
		</View>
	);
}
