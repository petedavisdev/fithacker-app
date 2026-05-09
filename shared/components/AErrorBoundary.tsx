import React from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AButton } from './AButton';
import { AText } from './AText';

type QueryErrorBoundaryProps = {
	children: React.ReactNode;
};

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

type ErrorFallbackProps = {
	error: unknown;
	resetErrorBoundary: () => void;
};

function ErrorFallback(props: ErrorFallbackProps) {
	const { t } = useTranslation();
	const message =
		props.error instanceof Error ? props.error.message : String(props.error);
	return (
		<View className="flex-1 items-center justify-center p-4 bg-bg">
			<AText color="pink" shade={500} size="xl" className="mb-4">
				{t('_errors.somethingWentWrong')}
			</AText>
			<AText className="mb-4">{message}</AText>
			<AButton onPress={props.resetErrorBoundary}>🔄</AButton>
		</View>
	);
}
