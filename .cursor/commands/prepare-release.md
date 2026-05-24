# /prepare-release

Prepares the app for release.

## Usage

```
/prepare-release [version?]
```

If no version provided, reads current version from `app.config.js` and asks: "Current version is X.Y.Z. Bump to? (major/minor/patch or specify version)"

Version must use full semver format: `Major.Minor.Patch` (e.g., `1.2.0`)

## What it does

- Reads current version from app.config.js
- Prompts for version bump type if not provided
- Updates version in app.config.js
- Creates release checklist
- Checks all translations are complete
- Verifies no console.logs

## References

See `.cursor/rules/build-deploy.mdc` for:

- Build scripts
- Environment variants
- App Store release workflow

**Source of Truth**:

- Version location: `app.config.js` (`expo.version`)
- Languages: `i18n/index.ts` (`resources` object)
- Store metadata: `store.config.json`
- App Store translations: `docs/appStore.json`

## Example

```
/prepare-release 2.0.0
```

Checklist generated:

- [ ] Update app.config.js version to 2.0.0
- [ ] Run translation check
- [ ] Remove console.logs
- [ ] Run test suite
- [ ] Update `store.config.json` releaseNotes from `docs/appStore.json`
- [ ] Validate store config: `npx eas metadata:lint`
- [ ] Deploy schema if needed: `npm run deploy:schema`
- [ ] Build & submit iOS binary: `npm run ios:prod`
- [ ] Push store metadata: `npx eas metadata:push`
- [ ] Upload screenshots manually in App Store Connect
- [ ] Create git tag v2.0.0
- [ ] Submit for App Store review
