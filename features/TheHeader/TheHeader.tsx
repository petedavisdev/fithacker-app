import { Text, View } from 'react-native';

import { AButton } from '@/shared/components/AButton';
import { AModal } from '@/shared/components/AModal';
import { HelpSuggestions } from './HelpSuggestions';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { useIsLoggedIn } from '@/features/Account/useAuthSession';
import { useIsOnline } from '@/shared/queries/useNetworkStatus';
import { useUserProfile } from '@/features/Account/useUserProfile';

type TheHeaderButtons = 'account' | 'help' | 'back' | 'notes' | 'chart';

type TheHeaderProps = {
	buttonLeft?: TheHeaderButtons;
	buttonRight?: TheHeaderButtons;
};

export function TheHeader(props: TheHeaderProps) {
	const [isHelpOpen, setIsHelpOpen] = React.useState(false);
	const router = useRouter();
	const loggedIn = useIsLoggedIn();
	const isOnline = useIsOnline();
	const { userProfile } = useUserProfile();

	function open() {
		setIsHelpOpen(true);
	}

	function closeHelp() {
		setIsHelpOpen(false);
	}

	function handleBack() {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace('/chart');
		}
	}

	const accountEmoji = !isOnline
		? '🫥'
		: userProfile
			? '😎'
			: loggedIn
				? '😀'
				: '👤';

	// Create buttons inside component to avoid stale closures
	const headerButtons = {
		account: (
			<AButton href="/account" size="sm">
				{accountEmoji}
			</AButton>
		),
		help: (
			<AButton onPress={open} color="pink" size="sm">
				?
			</AButton>
		),
		back: (
			<AButton onPress={handleBack} size="sm">
				👈
			</AButton>
		),
		notes: (
			<AButton href="/notes" size="sm" color="cyan">
				📝
			</AButton>
		),
		chart: (
			<AButton href="/chart" size="sm" color="cyan">
				📊
			</AButton>
		),
	};

	return (
		<View className="w-full flex-row justify-center p-4">
			<View className="w-full max-w-96 flex-row justify-between">
				<View className="h-10 w-10">
					{props.buttonLeft && headerButtons[props.buttonLeft]}
				</View>

				<Link href="/" className="flex-row">
					<Text className="font-mono text-xl text-yellow-500">FIT</Text>
					<Text className="font-mono text-xl text-cyan-500">HACKER</Text>
				</Link>

				<View className="h-10 w-10">
					{props.buttonRight && headerButtons[props.buttonRight]}
				</View>
			</View>

			<AModal isOpen={isHelpOpen} onClose={closeHelp}>
				<HelpSuggestions />
			</AModal>
		</View>
	);
}
