# Maestro Screenshot Automation (iOS Only)

This directory contains Maestro flows for automated App Store screenshot generation.

**Note:** iOS only - Android screenshots are not needed as the app is not in the Play Store.

## Prerequisites

1. **Maestro CLI**

   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   export PATH="$HOME/.maestro/bin:$PATH"
   ```

2. **Java 17+** (required by Maestro)
   - See [SETUP.md](SETUP.md) for installation options

3. **iOS Simulator** booted

   ```bash
   # List available simulators
   xcrun simctl list devices

   # Boot a simulator (if not already running)
   xcrun simctl boot "iPhone 15 Pro"
   ```

## Build the App

Build and install the app on the simulator:

```bash
# 1. Create native iOS project (if not already done)
npx expo prebuild --platform ios

# 2. Build for simulator
cd ios && xcodebuild -workspace Fithacker.xcworkspace -scheme Fithacker \
  -configuration Debug -sdk iphonesimulator -derivedDataPath build

# 3. Install on booted simulator
xcrun simctl install booted build/Build/Products/Debug-iphonesimulator/Fithacker.app
```

## Running Screenshots

**Important:** Metro bundler must be running in a separate terminal.

```bash
# Terminal 1: Start Metro bundler (required)
npm start

# Terminal 2: Run screenshot flows
```

### Single Flow

```bash
maestro test .maestro/flows/screenshot-home.yaml
```

### All Flows for One Locale

```bash
./scripts/run-all-screenshots.sh en
```

### All Locales (manual locale switching)

```bash
./scripts/run-all-screenshots.sh --all-locales
```

## How It Works

1. **Seed Data**: Each flow opens `fithacker://seed` deep link, which populates AsyncStorage with sample exercise log data.

2. **Dev Launcher**: Flows tap through the Expo dev launcher UI to connect to Metro bundler.

3. **Navigation**: Emoji buttons use coordinate-based taps (the AEmoji component doesn't expose accessibility text for Maestro to find).

4. **Screenshots**: Saved to `docs/screenshots-YYYY-MM-DD/iPhone/` with locale prefix (e.g., `en1.png`, `en2.png`).

## Screenshots Captured

| #   | Screen  | Description                        |
| --- | ------- | ---------------------------------- |
| 1   | Home    | Checklist with exercise emojis     |
| 2   | Chart   | Historical activity chart          |
| 3   | Notes   | Notes screen with exercise details |
| 4   | Filter  | Chart with cardio filter applied   |
| 5   | Account | Account/login screen               |

## Troubleshooting

### "No devices found"

- Ensure a simulator is booted: `xcrun simctl list devices | grep Booted`
- Ensure the app is installed: `xcrun simctl listapps booted | grep fithacker`

### Screenshots show dev launcher

- Metro bundler must be running (`npm start`)
- Flows automatically tap through the dev launcher UI

### Navigation not working

- Emoji buttons use coordinate taps which may vary by device
- Check the flow files in `.maestro/flows/` for tap coordinates

### Build errors

- Run `npx expo prebuild --clean --platform ios` to regenerate native project
- Ensure Xcode and CocoaPods are up to date
