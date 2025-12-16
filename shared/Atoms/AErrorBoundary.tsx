import React from 'react';
import { View, Text } from 'react-native';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { AButton } from '@/shared/Atoms/AButton';

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
						<View className="flex-1 items-center justify-center p-4">
							<Text className="text-pink-500 text-xl mb-4">
								Something went wrong
							</Text>
							<Text className="text-cyan-400 mb-4">{error.message}</Text>
							<AButton onPress={resetErrorBoundary}>Try again</AButton>
						</View>
					)}
				>
					{props.children}
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}




