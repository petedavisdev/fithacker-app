# Maestro Screenshot Automation (iOS Only)

Automated App Store screenshot generation using Maestro. Captures 5 screenshots per locale across iPhone and iPad.

**Note:** iOS only — the app is not in the Play Store.

## Prerequisites

1. **Java** — Required by Maestro. See [SETUP.md](SETUP.md) for installation.
2. **Maestro CLI**:
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   export PATH="$HOME/.maestro/bin:$PATH"
   ```
3. **Xcode and iOS Simulators** — Available from Mac App Store (free)
4. **iPad simulator set to full-screen mode** — See "iPad Simulator Setup" below

## iPad Simulator Setup (One-Time, Per Machine)

The iPad simulator defaults to "Windowed Apps" mode (Stage Manager), which causes the app to open in a floating window rather than full-screen. This makes screenshots show the iPad desktop behind the app.

**Fix (one-time per machine):**

1. Boot the iPad simulator: `xcrun simctl boot "iPad Pro 13-inch (M4)" && open -a Simulator`
2. In the simulator, go to **Settings → Multitasking & Gestures**
3. Under **"iPad Multitasking"**, change **"Allow Multiple Apps"** to **off**, or switch from **"Windowed Apps"** to **"Full Screen Apps"**
4. Quit and reboot the simulator

The simulator remembers this setting permanently, so you only need to do it once per machine.

## Build (One-Time Setup)

### 1. Remove expo-dev-client (if present)

The app must be built without the Expo dev client UI for clean screenshots:

```bash
npm uninstall expo-dev-client
```

### 2. Rebuild iOS project

```bash
APP_VARIANT=production npx expo prebuild --platform ios --clean
```

`APP_VARIANT=production` ensures the correct bundle ID (`dev.petedavis.fithacker`).

### 3. Build with xcodebuild

```bash
cd ios
xcodebuild -workspace Fithacker.xcworkspace \
  -scheme Fithacker \
  -configuration Debug \
  -sdk iphonesimulator \
  -derivedDataPath build
```

Once built, you can run screenshots repeatedly without rebuilding.

## Generate Screenshots

Start Metro in a separate terminal first:

```bash
npm start
```

Then run the script (it handles simulator booting and app installation):

```bash
# Verify prerequisites (Java, Maestro, Metro, app build, simulator)
./scripts/run-all-screenshots.sh --check-only
./scripts/run-all-screenshots.sh --check-only --ipad

# Single locale — iPhone (default)
./scripts/run-all-screenshots.sh en

# Single locale — iPad
./scripts/run-all-screenshots.sh en --ipad

# All 9 locales — iPhone
./scripts/run-all-screenshots.sh --all-locales

# All 9 locales — iPad
./scripts/run-all-screenshots.sh --ipad --all-locales

# All 9 locales — both devices
./scripts/run-all-screenshots.sh --all-devices --all-locales

# Resume from a specific locale after a failure
./scripts/run-all-screenshots.sh --resume-from fr --ipad --all-locales
```

Screenshots are saved as `{locale}1.png` through `{locale}5.png` in `docs/screenshots-YYYY-MM-DD/iPhone/` or `.../iPad/`.

## How It Works

A single Maestro flow (`.maestro/flows/screenshot-all.yaml`) captures all 5 screenshots per locale without restarting the app:

1. **Launch app** and wait for it to settle
2. **Deep link** to `fithacker://seed-empty` → `fithacker://` → screenshot 1 (empty home)
3. **Deep link** to `fithacker://seed` → `fithacker://` → screenshot 2 (home with data)
4. **Deep link** to `fithacker://chart` → screenshot 3
5. **Deep link** to `fithacker://notes` → screenshot 4
6. **Deep link** to `fithacker://account` → screenshot 5

The shell script (`scripts/run-all-screenshots.sh`) wraps this:

- Boots the correct simulator (iPhone or iPad)
- Installs the app
- Switches locale via `xcrun simctl` before each run
- Terminates the app so it relaunches in the new language
- Tracks progress (`[3/9] fr (iPad)`) and elapsed time
- Reports failures with a `--resume-from` hint

## Screenshots Captured

5 screenshots per locale:

1. **Home (empty)** — Home screen before any data is seeded
2. **Home (with data)** — Main screen with exercise checklist
3. **Chart** — Historical chart view with all exercises
4. **Notes** — Notes screen with exercise details and dates
5. **Account** — Login/account screen

## Deep Link Routes

The screenshot flow uses these Expo Router routes:

| Route                    | Purpose                                                |
| ------------------------ | ------------------------------------------------------ |
| `fithacker://seed-empty` | Clears exercise log, suppresses LogBox warnings        |
| `fithacker://seed`       | Seeds sample exercise data, suppresses LogBox warnings |
| `fithacker://`           | Home (index) page                                      |
| `fithacker://chart`      | Chart page                                             |
| `fithacker://notes`      | Notes page                                             |
| `fithacker://account`    | Account page                                           |

The seed routes (`app/seed-empty.tsx`, `app/seed.tsx`) write to AsyncStorage and call `LogBox.ignoreAllLogs(true)` at module load to suppress warnings during screenshots.

## Supported Locales

de, en, es, fr, it, ja, ko, pt, zh

## Troubleshooting

- **"0 devices connected"** — The Simulator app must be open with a device booted. The script handles this automatically, but you can also run manually: `xcrun simctl boot "iPhone 15 Pro"` then `open -a Simulator`.
- **"Failed to boot iPad Pro 13-inch (M4)"** — Your Xcode may have a different iPad simulator. List available: `xcrun simctl list devices available | grep -i ipad`. Edit `IPAD_SIMULATOR` in `scripts/run-all-screenshots.sh`.
- **Metro connection refused** — Start Metro with `npm start` before running. Use `--check-only` to verify.
- **Screenshots show warning banners** — The seed routes suppress warnings via `LogBox.ignoreAllLogs(true)`. If a new warning appears, check that the seed route is being hit before the first screenshot.
- **kAXErrorInvalidUIElement crash** — Usually means the view hierarchy was queried during a screen transition. The `waitForAnimationToEnd` steps in the flow handle this. If it recurs, try increasing the wait.
