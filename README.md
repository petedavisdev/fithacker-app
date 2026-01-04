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

**Start dev server:**

```bash
npm run web
```

**⚠️ Environment Variable Changes**: If you update `.env` (e.g., after `npm run env:pull`):

```bash
# 1. Clear Node's module cache (REQUIRED - dotenv values are cached here)
rm -rf node_modules/.cache

# 2. Kill running dev server
pkill -f "expo|metro|node.*expo"

# 3. Restart
npm run web
```

Metro's `--clear` flag doesn't help because the cache is in Node, not Metro.

**Build for deployment:**

```bash
npm run web:build
```

**When Rebuilds Are Required:**

- **Environment variables**: Changes to `.env` require cache clearing for dev server (see above), and rebuilding for production builds
- **Native code changes**: Always require rebuilding native apps (iOS/Android)
- **Config changes**: Changes to `app.config.js` that affect native configs require rebuilds
- **Plugin changes**: Changes to Expo plugins require rebuilds
- **Asset changes**: Changes to icons, splash screens, or other bundled assets require rebuilds

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

### Supabase Development

The project uses Supabase for backend services. Common Supabase CLI commands are available as npm scripts.

**First-time setup:**

1. **Login to Supabase CLI** (required for most commands):

```bash
npm run supabase:login
```

This will open a browser to authenticate. Alternatively, set `SUPABASE_ACCESS_TOKEN` environment variable.

2. **Generate TypeScript types** (after schema changes):

```bash
npm run supabase:types
```

This updates `shared/supabase/database.types.ts` with the latest schema.

**Schema Management (Declarative Approach):**

- **Single Source of Truth**: `supabase/schemas/schema.sql` contains the complete desired database state
- Edit `supabase/schemas/schema.sql` directly to make schema changes
- Generate migration from diff: `npm run supabase:schema:diff <migration-name>`
- Pull latest schema from production: `npm run supabase:schema:pull`
- After schema changes, regenerate types: `npm run supabase:types`
- Verify types are in sync: `npm run verify:types` (part of `npm run checks`)
- Works seamlessly with Supabase database branching

**Available Supabase scripts:**

- `npm run supabase:login` - Authenticate with Supabase CLI
- `npm run supabase:types` - Generate TypeScript types from database schema
- `npm run verify:types` - Verify types match schema (fails if out of sync)
- `npm run supabase:status` - List all Supabase projects
- `npm run supabase:migrations` - List database migrations
- `npm run supabase:schema:pull` - Pull latest schema from production to `supabase/schemas/schema.sql`
- `npm run supabase:schema:diff` - Generate migration from schema changes (requires migration name)
- `npm run supabase:db:diff` - Show schema differences (informational)
- `npm run supabase:db:reset` - Reset database (use with caution)
- `npm run supabase:logs:api` - View API logs
- `npm run supabase:logs:postgres` - View Postgres logs
- `npm run supabase:logs:realtime` - View Realtime logs

**Project ID:** `eujlarqrbwllnmxlhbsk` (configured in scripts)

### Testing

Run the Jest test suite:

```bash
npm test
```

Tests are co-located with source files using the `.test.ts` or `.test.tsx` extension.

### Continuous Integration

GitHub Actions automatically runs checks on all pull requests to `main`:

- Supabase types verification (ensures types match schema)
- Linting (ESLint)
- Tests (Jest)
- Formatting (Prettier)
- Schema drift detection (informational)

**Required GitHub Secret:**

- `SUPABASE_ACCESS_TOKEN` - Get from `cat ~/.supabase/access-token` or https://supabase.com/dashboard/account/tokens

See `.github/workflows/README.md` for detailed CI documentation.

### Production Deployment

**Important**: Database schema must be deployed **before** code deployment.

#### Deployment Workflow

1. **Check for schema changes**:

   ```bash
   npm run supabase:db:diff
   ```

2. **Deploy schema first** (if changes exist):

   ```bash
   npm run deploy:schema
   # Or manually: npx supabase db push --linked
   ```

3. **Deploy code**:
   ```bash
   npm run deploy:prod
   # Or for specific platforms:
   npm run web:prod      # Web deployment
   npm run ios:prod      # iOS build
   ```

#### Automated Deployment Script

The `deploy:prod` script automates the process:

```bash
npm run deploy:prod
```

This script:

- ✅ Checks for schema changes
- ✅ Prompts to apply schema migrations (manual approval)
- ✅ Deploys schema first if approved
- ✅ Deploys code second

**Why deploy schema first?**

- Code may depend on new database structure
- If migration fails, code hasn't deployed yet (safer)
- Forward-compatible: old code works with new schema

#### Manual Deployment Steps

If you prefer manual control:

```bash
# 1. Check schema drift
npm run supabase:db:diff

# 2. Deploy schema (if needed)
npm run deploy:schema

# 3. Deploy web
npm run web:prod

# 4. Deploy iOS (if needed)
npm run ios:prod
```

#### Schema Changes Workflow

**⚠️ Critical**: All schema changes must be **backward compatible** - iOS apps can't be force-updated and may lag behind web deployments for months.

1. **Question the change** (YAGNI): Is this schema change actually necessary? Can JSONB handle it?
2. Edit `supabase/schemas/schema.sql` in feature branch
3. Generate migration: `npm run supabase:schema:diff <migration-name>`
4. **Verify backward compatibility**: Test that old iOS app version still works
5. Test locally or in preview environment
6. PR gets reviewed and merged to `main`
7. **Before deploying code**: Run `npm run deploy:schema` to apply migrations
8. Deploy code: `npm run deploy:prod`

**Schema Evolution Rules:**

- ✅ Add nullable columns or columns with defaults
- ✅ Add new tables
- ✅ Use JSONB for flexible data (preferred - zero schema churn)
- ✅ Relax constraints (make more permissive)
- ❌ Never remove columns, rename columns, or change types
- ❌ Never add NOT NULL without defaults
- ❌ Never tighten constraints

See `.cursor/rules/schema-evolution.mdc` for complete guidelines.

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
