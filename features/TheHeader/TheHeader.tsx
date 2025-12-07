import { Text, View } from 'react-native';

import { AButton } from '../Atoms/AButton';
import { AModal } from '../Atoms/AModal';
import { HelpSuggestions } from './HelpSuggestions';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { isLoggedIn, onAuthStateChange } from '../supabase/auth';
import { useNetworkStatus } from '../supabase/useNetworkStatus';

type TheHeaderButtons = 'account' | 'help';

type TheHeaderProps = {
	buttonLeft?: TheHeaderButtons;
	buttonRight?: TheHeaderButtons;
	helpContent?: React.ReactNode;
};

export function TheHeader(props: TheHeaderProps) {
	const [isHelpOpen, setIsHelpOpen] = React.useState(false);
	const [loggedIn, setLoggedIn] = useState(false);
	const { isOnline } = useNetworkStatus();

	useEffect(() => {
		// Initial check
		isLoggedIn().then(setLoggedIn);

		// Listen for auth state changes
		const {
			data: { subscription },
		} = onAuthStateChange((loggedIn) => {
			setLoggedIn(loggedIn);
		});

		return () => subscription?.unsubscribe();
	}, []);

	function open() {
		setIsHelpOpen(true);
	}

	function closeHelp() {
		setIsHelpOpen(false);
	}

	// Determine emoji: 🫥 for offline, 😀 for logged in, 👤 for logged out
	const accountEmoji = !isOnline ? '🫥' : loggedIn ? '😀' : '👤';

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
	};

	return (
		<View className="w-full flex-row justify-center p-4">
			<View className="w-full flex-row justify-between">
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
				{props.helpContent || <HelpSuggestions />}
			</AModal>
		</View>
	);
}
