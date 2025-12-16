const { fn } = require('jest-mock');
const React = require('react');

const mockClient = {
	setQueryData: fn(),
	getQueryData: fn(),
	invalidateQueries: fn(),
};

module.exports = {
	useQuery: fn(),
	useMutation: fn(() => ({ mutate: fn() })),
	useQueryClient: fn(() => mockClient),
	QueryClient: fn(() => mockClient),
	QueryClientProvider: ({ children }) => React.createElement(React.Fragment, null, children),
	QueryErrorResetBoundary: ({ children }) => children({ reset: fn() }),
};




