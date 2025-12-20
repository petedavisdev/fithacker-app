import React from 'react';
import { View, Text } from 'react-native';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { AButton } from '@/shared/components/AButton';

type QueryErrorBoundaryProps = {
	children: React.ReactNode;
};

function ErrorFallback({
	error,
	resetErrorBoundary,
}: {
	error: Error;
	resetErrorBoundary: () => void;
}) {
	const { t } = useTranslation();
	return (
		<View className="flex-1 items-center justify-center p-4">
			<Text className="text-pink-500 text-xl mb-4">
				{t('_@.somethingWentWrong')}
			</Text>
			<Text className="text-cyan-400 mb-4">{error.message}</Text>
			<AButton onPress={resetErrorBoundary}>{t('_@.tryAgain')}</AButton>
		</View>
	);
}

export function QueryErrorBoundary(props: QueryErrorBoundaryProps) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					onReset={reset}
					fallbackRender={({ error, resetErrorBoundary }) => (
						<ErrorFallback
							error={error}
							resetErrorBoundary={resetErrorBoundary}
						/>
					)}
				>
					{props.children}
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
