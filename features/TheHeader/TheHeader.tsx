import React, { useContext } from 'react';
import { Text, View } from 'react-native';

import { AButton } from '../Atoms/AButton';
import { AModal } from '../Atoms/AModal';
import { HelpSuggestions } from './HelpSuggestions';
import { Link } from 'expo-router';
import { User } from '../User/User';
import { UserAccount } from '../User/UserAccount';
import { UserContext } from '../../app/_layout';

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
	const user = useContext(UserContext);

	headerButtons.account = (
		<AButton onPress={() => setIsAccountOpen(true)} size="sm">
			{user ? '😎' : '👋'}
		</AButton>
	);

	const [isHelpOpen, setIsHelpOpen] = React.useState(false);

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
				<UserAccount />
			</AModal>

			<AModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)}>
				<HelpSuggestions />
			</AModal>
		</View>
	);
}
