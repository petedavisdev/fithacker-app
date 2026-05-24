// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');

module.exports = defineConfig([
	...expo,
	{
		ignores: ['dist/**'],
	},
	{
		// eslint-config-expo's core config sets import/resolver: { typescript: true }
		// which causes eslint-module-utils to try to load eslint-import-resolver-typescript
		// from the wrong location (nested inside eslint-config-expo/node_modules).
		// Override all file patterns to remove the typescript resolver.
		settings: {
			'import/resolver': {
				node: true,
			},
		},
		rules: {
			'expo/use-dom-exports': 'off',
			// Metro resolves platform-specific files (.native.ts, .web.ts) via
			// moduleSuffixes in tsconfig, which standard ESLint resolvers don't support.
			'import/no-unresolved': 'off',
		},
	},
]);
