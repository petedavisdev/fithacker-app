import { View, Pressable } from 'react-native';
import React from 'react';
import { Link, type LinkProps } from 'expo-router';
import { AText } from './AText';

type LinkButtonProps = {
	href: LinkProps['href'];
};

type PressableButtonProps = {
	onPress: () => void;
};

type AButtonProps = (LinkButtonProps | PressableButtonProps) & {
	children: React.ReactNode;
	color?: 'pink' | 'cyan';
	size?: 'sm';
	isDisabled?: boolean;
};

export function AButton(props: AButtonProps) {
	const shadowColor =
		props.color === 'pink'
			? '#be185d'
			: props.color === 'cyan'
				? '#0e7490'
				: '#a16207';

	const button: JSX.Element = (
		<View
			className={`flex items-center justify-center border-2 bg-bg rounded-full ${
				props.color === 'pink'
					? 'border-pink-600'
					: props.color === 'cyan'
						? 'border-cyan-600'
						: 'border-yellow-600'
			} ${props.size === 'sm' ? 'w-10 h-10' : 'w-20 h-20'}
			}`}
			style={{
				shadowColor,
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.25,
				shadowRadius: 3.84,
				elevation: 5,
			}}
		>
			<AText
				color={
					props.color === 'pink'
						? 'pink'
						: props.color === 'cyan'
							? 'cyan'
							: 'yellow'
				}
				shade={500}
				className={`${props.size === 'sm' ? 'text-2xl' : 'text-4xl'}`}
			>
				{props.children}
			</AText>
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
