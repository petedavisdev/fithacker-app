import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Link, type LinkProps } from 'expo-router';

type LinkButtonProps = {
	href: LinkProps['href'];
};

type PressableButtonProps = {
	onPress: () => void;
};

type AButtonProps = (LinkButtonProps | PressableButtonProps) & {
	children: React.ReactNode;
	size?: 'sm';
	isHidden?: boolean;
};

export function AButton(props: AButtonProps) {
	const button: JSX.Element = (
		<View
			className={`flex items-center justify-center border-2 border-yellow-600 bg-[#112] rounded-full shadow shadow-yellow-700 ${
				props.size === 'sm' ? 'w-10 h-10' : 'w-20 h-20'
			}`}
		>
			<Text
				className={`text-2xl text-yellow-500 ${
					props.size === 'sm' ? 'text-2xl' : 'text-4xl'
				}`}
			>
				{props.children}
			</Text>
		</View>
	);

	if ('href' in props) {
		return (
			<Link
				href={props.href}
				className={props.isHidden ? 'invisible' : ''}
			>
				{button}
			</Link>
		);
	} else {
		return (
			<Pressable
				onPress={props.onPress}
				className={props.isHidden ? 'invisible' : ''}
			>
				{button}
			</Pressable>
		);
	}
}
