# Maestro Setup Instructions

## 1. Install Maestro CLI

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
export PATH="$HOME/.maestro/bin:$PATH"
```

Add to your shell profile (e.g., `~/.zshrc`):

```bash
export PATH="$HOME/.maestro/bin:$PATH"
```

## 2. Install Java 17+ (Required)

Maestro requires Java to run. Choose one option:

### Option A: Oracle JDK (Recommended)

1. Download from: https://www.oracle.com/java/technologies/downloads/#java17-mac
2. Install the `.dmg` file
3. Verify: `java -version`

### Option B: Homebrew

```bash
brew install --cask temurin
```

### Option C: SDKMAN

```bash
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install java 17.0.9-tem
```

## 3. Verify Installation

```bash
maestro --version
```

You should see the Maestro version without Java errors.

## 4. Build the App

```bash
# Create native iOS project
npx expo prebuild --platform ios

# Build for simulator
cd ios && xcodebuild -workspace Fithacker.xcworkspace -scheme Fithacker \
  -configuration Debug -sdk iphonesimulator -derivedDataPath build

# Install on booted simulator
xcrun simctl install booted build/Build/Products/Debug-iphonesimulator/Fithacker.app
```

## 5. Run Screenshots

**Metro bundler must be running** in a separate terminal:

```bash
# Terminal 1
npm start

# Terminal 2
maestro test .maestro/flows/screenshot-home.yaml
```

See [README.md](README.md) for full usage instructions.
