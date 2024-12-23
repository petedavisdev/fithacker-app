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
	color?: 'pink';
	size?: 'sm';
	isDisabled?: boolean;
};

export function AButton(props: AButtonProps) {
	const button: JSX.Element = (
		<View
			className={`flex items-center justify-center border-2  bg-[#112] rounded-full shadow  ${
				props.color === 'pink'
					? 'border-pink-600 shadow-pink-700'
					: 'border-yellow-600 shadow-yellow-700'
			} ${props.size === 'sm' ? 'w-10 h-10' : 'w-20 h-20'}
			}`}
		>
			<Text
				className={`text-2xl  ${
					props.color === 'pink' ? 'text-pink-500' : 'text-yellow-500'
				} ${props.size === 'sm' ? 'text-2xl' : 'text-4xl'}`}
			>
				{props.children}
			</Text>
		</View>
	);

	if (props.isDisabled) {
		return <View className="opacity-35">{button}</View>;
	} else if ('href' in props) {
		return <Link href={props.href}>{button}</Link>;
	} else {
		return <Pressable onPress={props.onPress}>{button}</Pressable>;
	}
}
