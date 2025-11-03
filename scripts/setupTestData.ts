/**
 * Test data setup utility for migration testing
 * 
 * Loads data/EXERCISE_LOG.json into AsyncStorage (native) or localStorage (web)
 * under the 'exerciseLog' key to simulate existing user data.
 * 
 * Usage in browser console:
 *   import('./scripts/setupTestData').then(m => m.setupTestData())
 * 
 * Or if exposed globally:
 *   window.setupTestData()
 */

import exerciseLogData from '../data/EXERCISE_LOG.json';

export async function setupTestData() {
	try {
		const dataString = JSON.stringify(exerciseLogData);

		// Try AsyncStorage first (for React Native)
		try {
			const AsyncStorage = await import(
				'@react-native-async-storage/async-storage'
			);
			await AsyncStorage.default.setItem('exerciseLog', dataString);
			console.log('✅ Test data loaded into AsyncStorage (native)');
			return;
		} catch {
			// AsyncStorage not available, fall back to localStorage (web)
		}

		// Use localStorage for web
		if (typeof window !== 'undefined' && window.localStorage) {
			localStorage.setItem('exerciseLog', dataString);
			console.log('✅ Test data loaded into localStorage (web)');
			console.log(
				'   Refresh the page to see the app render with old format data',
			);
		} else {
			throw new Error('Neither AsyncStorage nor localStorage available');
		}
	} catch (error) {
		console.error('❌ Failed to setup test data:', error);
		throw error;
	}
}

// Expose globally for browser console access
if (typeof window !== 'undefined') {
	(window as any).setupTestData = setupTestData;
}
