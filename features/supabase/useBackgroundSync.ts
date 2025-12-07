import { useEffect } from 'react'
import { syncAll } from './sync'
import { useNetworkStatus } from './useNetworkStatus'
import { isLoggedIn, onAuthStateChange } from './auth'

export function useBackgroundSync() {
	const { isOnline } = useNetworkStatus()

	// Trigger sync when online AND logged in
	useEffect(() => {
		if (!isOnline) return

		async function doSync() {
			const loggedIn = await isLoggedIn()
			if (!loggedIn) return // Only sync if logged in

			await syncAll()
		}

		doSync().catch((error) => {
			console.error('Background sync failed:', error)
		})
	}, [isOnline])

	// Listen to auth changes (when user logs in)
	useEffect(() => {
		const {
			data: { subscription },
		} = onAuthStateChange((loggedIn) => {
			if (loggedIn && isOnline) {
				// User just logged in, trigger sync
				syncAll().catch((error) => {
					console.error('Sync after login failed:', error)
				})
			}
		})

		return () => {
			subscription?.unsubscribe()
		}
	}, [isOnline])

	// Manual sync trigger for UI button
	const triggerSync = async () => {
		const loggedIn = await isLoggedIn()
		if (!loggedIn) {
			console.warn('Cannot sync: not logged in')
			return
		}

		if (!isOnline) {
			console.warn('Cannot sync: offline')
			return
		}

		await syncAll()
	}

	return { triggerSync }
}

