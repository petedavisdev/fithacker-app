import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AButton } from '@/shared/components/AButton';

type ErrorFallbackProps = {
	error: Error;
	resetErrorBoundary: () => void;
};

export function ErrorFallback(props: ErrorFallbackProps) {
	const { t } = useTranslation();
	return (
		<View className="flex-1 items-center justify-center p-4">
			<Text className="text-pink-500 text-xl mb-4">
				{t('_@.somethingWentWrong')}
			</Text>
			<Text className="text-cyan-400 mb-4">{props.error.message}</Text>
			<AButton onPress={props.resetErrorBoundary}>{t('_@.tryAgain')}</AButton>
		</View>
	);
}
