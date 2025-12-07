import * as Network from 'expo-network'
import { useEffect, useState } from 'react'

export function useNetworkStatus() {
	const [isOnline, setIsOnline] = useState(true)

	useEffect(() => {
		// Get initial network state
		Network.getNetworkStateAsync()
			.then((state) => {
				setIsOnline(state.isConnected ?? false)
			})
			.catch((error) => {
				console.error('Failed to get network state:', error)
			})

		// Listen for network changes
		const subscription = Network.addNetworkStateListener((state) => {
			setIsOnline(state.isConnected ?? false)
		})

		return () => {
			subscription?.remove()
		}
	}, [])

	return { isOnline }
}

