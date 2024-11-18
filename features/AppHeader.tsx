import { View, Text } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

export default function AppHeader() {
	return (
		<View className="w-full flex-row justify-center p-4">
			<Link href="/" className="flex-row">
				<Text className="font-mono text-lg text-yellow-500">FIT</Text>
				<Text className="font-mono text-lg text-cyan-500">HACKER</Text>
			</Link>

			{/* <Link href="/account">
							<View className="w-12 h-12 flex items-center justify-center border-2 border-yellow-500 rounded-full shadow shadow-yellow-500">
								<Text className="text-2xl">👋</Text>
							</View>
						</Link> */}
		</View>
	);
}
