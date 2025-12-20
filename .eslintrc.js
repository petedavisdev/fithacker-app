// https://docs.expo.dev/guides/using-eslint/
module.exports = {
	extends: 'expo',
	ignorePatterns: ['/dist/*'],
	rules: {
		'expo/use-dom-exports': 'off', // Rule not available in eslint-config-expo@10.0.0
	},
};
