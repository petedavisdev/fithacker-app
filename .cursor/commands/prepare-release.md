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

**Source of Truth**:

- Version location: `app.config.js` (`expo.version`)
- Languages: `i18n/index.ts` (`resources` object)

## Example

```
/prepare-release 1.2.0
```

Checklist generated:

- [ ] Update app.config.js version to 1.2.0
- [ ] Run translation check
- [ ] Remove console.logs
- [ ] Test on iOS simulator
- [ ] Test on Android
- [ ] Test web build
- [ ] Create git tag v1.2.0
- [ ] Submit to App Store
