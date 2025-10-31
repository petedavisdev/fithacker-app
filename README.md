# FITHACKER

🚶 🏃‍♀️ 🤸 💪 🌴 🦵

A simple fitness app built with React Native and Expo.

[Apple App Store](https://apps.apple.com/us/app/fithacker/id6737473687?platform=iphone)

[fithacker.app](https://fithacker.app)

## Development

This project uses [EAS development builds](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build), not Expo Go.

### Prerequisites

- Node.js and npm
- [EAS CLI](https://docs.expo.dev/build/setup/) - Install globally: `npm install -g eas-cli@latest`
- [Expo Orbit](https://expo.dev/orbit) (optional) - Simplifies installing and launching builds
- For iOS: Xcode and iOS Simulator
- For Android: Android Studio and emulator

Refer to [Expo's environment setup guide](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build) for detailed platform-specific requirements.

### Initial Setup

1. **Install dependencies**
```bash
npm install
```

2. **Login to EAS**
```bash
eas login
```

### Build Variants

The app supports multiple build variants configured in [`app.config.js`](./app.config.js) (see `APP_VARIANTS` array).

Set the variant using the `APP_VARIANT` environment variable:
```bash
APP_VARIANT=development npm run ios:dev
```

### Development Workflow

#### iOS Development

1. **Build development client** (first time or when native dependencies change)
```bash
npm run ios:dev
# or for simulator: npm run ios:sim
```

2. **Install the build**
   - Using Orbit: One-click install from the EAS dashboard
   - Manually: Download and drag to simulator, or run `eas build:run`

3. **Start the development server**
```bash
npm start
# or for iOS specifically: npm run ios
```

#### Android Development

1. **Build development client**
```bash
eas build --profile development --platform android
```

2. **Install the build**
   - Using Orbit: One-click install from the EAS dashboard
   - Manually: Download and install APK, or run `eas build:run`

3. **Start the development server**
```bash
npm start
# or for Android specifically: npm run android
```

#### Web Development

**Local development:**
```bash
npm run web
```

**Build for deployment:**
```bash
npm run web:build
```

### Available Scripts

See [`package.json`](./package.json) for all available scripts. Common commands:

- `npm start` - Start Expo dev server
- `npm test` - Run Jest tests
- `npm run ios:dev` - Build development build for iOS
- `npm run ios:update:prod` - Push OTA update to production

For a complete list of build, deploy, and utility scripts, refer to the `scripts` section in [`package.json`](./package.json).

### Version Management

Version is managed in [`app.config.js`](./app.config.js) (`expo.version` field). 

When releasing a new version:
- Update the version using full semver format: `Major.Minor.Patch` (e.g., `"2.1.0"`)
- This version is used as the `runtimeVersion` for EAS OTA updates
- See [Expo versioning docs](https://docs.expo.dev/versions/latest/config/app/#version) for details

### OTA Updates

Push over-the-air updates to production without rebuilding:
```bash
npm run ios:update:prod
```

This only works for JavaScript/asset changes. Native changes require a new build.

### Upgrading Dependencies

#### Upgrading Expo SDK

To upgrade to the latest Expo SDK version:

1. **Update the Expo package**
```bash
npm install expo@latest
```

2. **Upgrade all Expo dependencies**
```bash
npx expo install --fix
```

3. **Verify the upgrade**
```bash
npx expo-doctor
```

4. **Rebuild development clients**

Since native dependencies may have changed, you'll need to create new development builds:
```bash
npm run ios:dev
# and/or
eas build --profile development --platform android
```

5. **Review release notes**

Check the [Expo SDK release notes](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/) for breaking changes and migration steps.

#### Upgrading Other Dependencies

For non-Expo packages:
```bash
npm update  # Update all packages within their semver ranges
# or for specific packages to latest version
npm install package-name@latest
```

Always rebuild development clients after upgrading native dependencies. See [npm update docs](https://docs.npmjs.com/cli/commands/npm-update) for more details.

### Testing

Run the Jest test suite:
```bash
npm test
```

Tests are co-located with source files using the `.test.ts` or `.test.tsx` extension.

### Troubleshooting

#### Development build won't install

- Ensure your device/simulator meets the minimum OS requirements
- For iOS: Check that the provisioning profile is valid
- Try clearing EAS cache: `eas build --clear-cache`

#### Metro bundler connection issues

- Ensure your device is on the same network as your development machine
- Try restarting the dev server: Stop and run `npm start` again
- Clear Metro cache: `npm start -- --clear`

#### OTA update not appearing

- Verify the channel matches your build profile
- Check that only JS/asset changes were made (not native code)
- Updates may take a few minutes to propagate
- Force close and reopen the app

#### Build variants not working

- Ensure `APP_VARIANT` environment variable is set correctly
- Verify the variant exists in `app.config.js` APP_VARIANTS array
- Example: `APP_VARIANT=development eas build --profile development --platform ios`

