/**
 * Cleanup script to remove migration flag after all users have migrated
 * 
 * Run this after confirming 100% migration via analytics.
 * This is optional - leaving the flag is harmless, but cleanup is good practice.
 * 
 * Usage:
 *   - Add to a one-time migration cleanup command
 *   - Or run manually via browser console: cleanupMigrationFlag()
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function cleanupMigrationFlag() {
	try {
		await AsyncStorage.removeItem('exerciseLogMigrated');
		console.log('✅ Migration flag cleaned up');
		return true;
	} catch (error) {
		console.error('❌ Failed to cleanup migration flag:', error);
		return false;
	}
}

// Expose globally for browser console access
if (typeof window !== 'undefined') {
	(window as any).cleanupMigrationFlag = cleanupMigrationFlag;
}
