import React from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './ErrorFallback';

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
