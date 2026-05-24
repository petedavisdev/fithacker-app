import { View, Pressable } from 'react-native';
import React from 'react';
import { Link, type LinkProps } from 'expo-router';
import { AText } from './AText';
import { AEmoji } from './AEmoji';

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
	variant?: 'icon' | 'text';
};

export function AButton(props: AButtonProps) {
	// Round style only for single character (emoji icons); otherwise pill-shaped text button
	// variant overrides the heuristic (e.g. for multi-codepoint emojis like ✏️)
	const childrenStr = String(props.children);
	const charCount = Array.from(childrenStr).length;
	const isIconButton =
		props.variant === 'icon'
			? true
			: props.variant === 'text'
				? false
				: charCount === 1;

	const shadowColor =
		props.color === 'pink'
			? '#be185d'
			: props.color === 'cyan'
				? '#0e7490'
				: '#a16207';

	const button = isIconButton ? (
		// Circular icon button
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
			<AEmoji
				color={
					props.color === 'pink'
						? 'pink'
						: props.color === 'cyan'
							? 'cyan'
							: 'yellow'
				}
				shade={500}
				size={props.size === 'sm' ? '2xl' : '4xl'}
			>
				{props.children}
			</AEmoji>
		</View>
	) : (
		// Pill-shaped text button
		<View
			className={`px-4 py-2 items-center justify-center border-2 bg-bg rounded-full ${
				props.color === 'pink'
					? 'border-pink-500'
					: props.color === 'cyan'
						? 'border-cyan-500'
						: 'border-yellow-500'
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
				size="sm"
				className="text-balance text-center"
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
