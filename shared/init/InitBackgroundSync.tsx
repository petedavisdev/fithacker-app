import { useBackgroundSync } from '@/shared/queries/useBackgroundSync';

export function InitBackgroundSync() {
	useBackgroundSync();
	return null;
}
