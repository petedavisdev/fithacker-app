# Maestro Setup Instructions

## Java Installation Required

Maestro requires Java to run. Follow these steps:

### Install Java via Homebrew (Recommended)

```bash
brew install --cask temurin
```

### Verify Installation

```bash
java -version
```

You should see output like: `openjdk version "17.0.x"` or similar.

## Verify Maestro After Java Installation

Once Java is installed:

```bash
export PATH="$HOME/.maestro/bin:$PATH"
maestro --version
```

You should see Maestro version information without Java errors.

## Next Steps

After Java and Maestro are installed, see [README.md](README.md) for build and screenshot generation instructions.
