# Workflow Status

## Current State: Working

The Maestro screenshot automation is functional for iPhone screenshots.

### What's Working

- 5 screenshot flows (home, chart, notes, filter, account)
- Deep link seeding (`fithacker://seed`)
- Dev launcher tap-through (requires Metro running)
- Coordinate-based navigation for emoji buttons
- Dated output folders (`docs/screenshots-YYYY-MM-DD/iPhone/`)

### Quick Start

```bash
# Terminal 1: Start Metro
npm start

# Terminal 2: Run screenshots
./scripts/run-all-screenshots.sh en
```

### Full Setup

See [README.md](README.md) for prerequisites and build instructions.
