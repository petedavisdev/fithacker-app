import { Platform } from 'react-native';

// Web-safe AsyncStorage adapter (same pattern as client.ts and syncState.ts)
type AsyncStorageAdapter = {
	getItem: (key: string) => Promise<string | null>;
	setItem: (key: string, value: string) => Promise<void>;
	removeItem: (key: string) => Promise<void>;
};

let AsyncStorage: AsyncStorageAdapter;
if (Platform.OS !== 'web') {
	// Native platforms - safe to import immediately
	AsyncStorage = require('@react-native-async-storage/async-storage').default;
} else {
	// Web platform - create a localStorage adapter that checks for window
	AsyncStorage = {
		getItem: (key: string) => {
			if (typeof window !== 'undefined') {
				return Promise.resolve(window.localStorage.getItem(key));
			}
			return Promise.resolve(null);
		},
		setItem: (key: string, value: string) => {
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(key, value);
			}
			return Promise.resolve();
		},
		removeItem: (key: string) => {
			if (typeof window !== 'undefined') {
				window.localStorage.removeItem(key);
			}
			return Promise.resolve();
		},
	};
}

export default AsyncStorage;

