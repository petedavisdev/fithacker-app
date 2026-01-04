# Manual Testing Checklist

Run these tests on a real iOS device after each deployment to verify critical functionality.

**Before testing:** Ensure you have the latest version of the app installed on your iOS device. If you just deployed, you may need to rebuild and install a new build (especially for deep linking changes which require native rebuilds).

## Deep Linking

**Test Universal Links:**

1. Build a new iOS app (deep linking requires a native rebuild)
2. Open `https://fithacker.app/chart` in Safari on an iOS device
3. The app should open automatically if installed
4. Verify the chart displays correctly

## Offline Functionality

**Test offline mode:**

1. Enable airplane mode on device
2. Open app and verify it loads (uses cached data)
3. Make changes to exercise log
4. Disable airplane mode
5. Verify changes sync when connection restored

## Background Sync

**Test sync behavior:**

1. Make changes while online
2. Background the app (home button/swipe up)
3. Wait 10-15 seconds
4. Return to app
5. Verify sync indicator shows completion

## App State Restoration

**Test app lifecycle:**

1. Navigate to chart page
2. Background app for 30+ seconds
3. Return to app
4. Verify app restores to same screen/state
5. Verify no crashes or blank screens

## Basic Navigation

**Test core flows:**

1. Navigate between Home → Chart → Account
2. Verify header buttons work correctly
3. Verify back navigation works
4. Verify no navigation loops or stuck states
