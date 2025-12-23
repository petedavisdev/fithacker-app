import { Text, View } from 'react-native';

import { AButton } from '@/shared/components/AButton';
import { AModal } from '@/shared/components/AModal';
import { HelpSuggestions } from './HelpSuggestions';
import { Link, useRouter, usePathname } from 'expo-router';
import React from 'react';
import { useIsLoggedIn } from '@/features/Account/useAuthSession';
import { useIsOnline } from '@/shared/queries/useNetworkStatus';
import { useUserProfile } from '@/features/Account/useUserProfile';

type TheHeaderButtons = 'account' | 'help' | 'back';

type TheHeaderProps = {
	buttonLeft?: TheHeaderButtons;
	buttonRight?: TheHeaderButtons;
	helpContent?: React.ReactNode;
	customButtonLeft?: React.ReactNode;
	customButtonRight?: React.ReactNode;
};

export function TheHeader(props: TheHeaderProps) {
	const [isHelpOpen, setIsHelpOpen] = React.useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const loggedIn = useIsLoggedIn();
	const isOnline = useIsOnline();
	const { userProfile } = useUserProfile();

	const isAccountPage = pathname === '/account';

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
		account: isAccountPage ? (
			<AButton onPress={handleBack} size="sm" color="pink">
				👈
			</AButton>
		) : (
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
			<AButton onPress={handleBack} size="sm" color="pink">
				👈
			</AButton>
		),
	};

	return (
		<View className="w-full flex-row justify-center p-4">
			<View className="w-full max-w-96 flex-row justify-between">
				<View className="h-10 w-10">
					{props.customButtonLeft ||
						(props.buttonLeft && headerButtons[props.buttonLeft])}
				</View>

				<Link href="/" className="flex-row">
					<Text className="font-mono text-xl text-yellow-500">FIT</Text>
					<Text className="font-mono text-xl text-cyan-500">HACKER</Text>
				</Link>

				<View className="h-10 w-10">
					{props.customButtonRight ||
						(props.buttonRight && headerButtons[props.buttonRight])}
				</View>
			</View>

			<AModal isOpen={isHelpOpen} onClose={closeHelp}>
				{props.helpContent || <HelpSuggestions />}
			</AModal>
		</View>
	);
}
