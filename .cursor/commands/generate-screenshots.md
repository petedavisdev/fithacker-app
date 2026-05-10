# /generate-screenshots

Generates App Store screenshots for all locales using Maestro automation (iOS only).

## Agent Behavior

**STOP AND ASK the user immediately** if any of these occur:

- xcodebuild fails (missing SDK, expired certificates, no destinations)
- Simulator won't boot or app won't install
- Metro isn't running and can't be started
- Any prerequisite is missing that requires manual installation (Java, Maestro, Xcode platforms)
- EAS build or credential errors

Do NOT retry failing steps repeatedly. If something fails once and is clearly a configuration/environment issue, ask the user to fix it.

## Process (Two Phases)

### Phase 1: Verify with en-only screenshots

1. Build the simulator app with `APP_VARIANT=production`
2. Run `./scripts/run-all-screenshots.sh en` (iPhone only)
3. Run `./scripts/run-all-screenshots.sh en --ipad` (iPad only)
4. **Show the user `en2.png` from each device** (home with data — most representative)
5. Check for common issues:
   - System dialogs covering the screen
   - Upside-down orientation
   - Wrong app variant ("Fithacker (dev)" instead of "Fithacker")
   - Bundling/loading indicators visible
6. **Wait for user approval** before continuing

### Phase 2: Generate all locales

Only after the user confirms en screenshots look good:

```bash
./scripts/run-all-screenshots.sh --all-devices --all-locales
```

## Usage

```
/generate-screenshots [locale?] [--ipad] [--all-devices] [--all-locales]
```

If no locale provided, defaults to `en`. Use `--all-locales` for all 9 locales.

## Prerequisites

The script checks all of these automatically. Run `--check-only` to verify without generating:

1. **Java** — Required by Maestro (`brew install --cask temurin`)
2. **Maestro CLI** — `curl -Ls "https://get.maestro.mobile.dev" | bash`
3. **Metro bundler** — Must be running (`npm start`)
4. **iOS build** — App must be built with `APP_VARIANT=production` (see `.maestro/README.md`)
5. **iPad full-screen mode** — One-time per machine: in the iPad simulator go to Settings → Multitasking & Gestures → switch from "Windowed Apps" to "Full Screen Apps". See `.maestro/README.md` for details.

## Screenshots Captured

5 screenshots per locale, all via deep links (no UI taps):

| # | Screen | Deep link |
|---|--------|-----------|
| 1 | Home (empty) | `fithacker://seed-empty` → `fithacker://` |
| 2 | Home (with data) | `fithacker://seed` → `fithacker://` |
| 3 | Chart | `fithacker://chart` |
| 4 | Notes | `fithacker://notes` |
| 5 | Account | `fithacker://account` |

## Run Commands

```bash
# Verify prerequisites
./scripts/run-all-screenshots.sh --check-only

# Single locale — iPhone (default)
./scripts/run-all-screenshots.sh en

# Single locale — iPad
./scripts/run-all-screenshots.sh en --ipad

# All locales — both devices
./scripts/run-all-screenshots.sh --all-devices --all-locales

# Resume after failure
./scripts/run-all-screenshots.sh --resume-from fr --ipad --all-locales
```

## Output Structure

```
docs/screenshots-YYYY-MM-DD/
  iPhone/
    en1.png … en5.png
    de1.png … de5.png
    # ... (de, es, fr, it, ja, ko, pt, zh)
  iPad/
    en1.png … en5.png
    # ... same structure
```

## Supported Locales

de, en, es, fr, it, ja, ko, pt, zh

## Key Files

| File | Purpose |
|------|---------|
| `scripts/run-all-screenshots.sh` | Main script — simulator management, locale switching, progress tracking |
| `.maestro/flows/screenshot-all.yaml` | Single Maestro flow — 5 deep-link screenshots without app restart |
| `app/seed-empty.tsx` | Clears exercise data, suppresses LogBox warnings |
| `app/seed.tsx` | Seeds sample exercise data, suppresses LogBox warnings |
| `shared/utils/seedScreenshotData.ts` | Data seeding logic |
| `data/screenshot-sample.json` | Sample exercise data with relative dates |

## Known Issues & Manual Steps

- **iOS deep link dialog**: The Maestro flow includes `tapOn "Open" optional: true` to dismiss the iOS URL scheme confirmation. If the system language changes, this text may need updating.
- **`APP_VARIANT`**: The `.env` file has `APP_VARIANT=development`. The build step must explicitly use `APP_VARIANT=production` to get the correct bundle ID (`dev.petedavis.fithacker`).
- **iPad full-screen mode**: The iPad simulator defaults to "Windowed Apps" (Stage Manager). This must be changed to full-screen mode once per machine via Settings → Multitasking & Gestures. Without this, screenshots show the iPad desktop behind the app window. This is a persistent simulator setting — it survives reboots.

## Performance

~75 seconds per locale per device. All 9 locales on one device: ~11 minutes. Both devices: ~22 minutes.
