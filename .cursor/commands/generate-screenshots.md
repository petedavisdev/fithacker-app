# /generate-screenshots

Generates App Store screenshots for all locales using Maestro automation (iOS only).

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
4. **iOS build** — App must be built without expo-dev-client (see `.maestro/README.md`)

## What it does

1. **Checks prerequisites** — Java, Maestro, Metro, app build
2. **Boots simulator** — iPhone 15 Pro or iPad Pro 13-inch (M4)
3. **For each locale**: sets simulator language, runs a single Maestro flow that captures all 5 screenshots via deep links
4. **Reports progress** — `[3/9] fr (iPad) ✓ done (24s)`
5. **Reports failures** — with a `--resume-from` command to retry

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

# All locales — iPad
./scripts/run-all-screenshots.sh --ipad --all-locales

# All locales — both devices
./scripts/run-all-screenshots.sh --all-devices --all-locales

# Resume after failure
./scripts/run-all-screenshots.sh --resume-from fr --ipad --all-locales
```

## Output Structure

```
docs/screenshots-YYYY-MM-DD/
  iPhone/
    en1.png  # Home empty
    en2.png  # Home with data
    en3.png  # Chart
    en4.png  # Notes
    en5.png  # Account
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

## Performance

~25 seconds per locale. All 9 locales on one device: ~4 minutes. Both devices: ~8 minutes.
