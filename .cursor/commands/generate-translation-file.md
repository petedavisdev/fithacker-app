# /generate-translation-file

Creates new translation file for a language.

## Usage

```
/generate-translation-file [locale?]
```

If no locale provided:
- Lists existing languages from `i18n/index.ts`
- Prompts: "Which language to add? (e.g., pl, ru, nl)"

## What it creates

- Uses English as base
- Creates proper JSON structure
- Adds all existing keys
- Marks for translation

## References

See `.cursor/rules/i18n.mdc` for:

- Translation file structure
- Key naming conventions

See `.cursor/rules/build-deploy.mdc` for:

- How to update app.config.js CFBundleLocalizations

## Example

```
/generate-translation-file pl
```

Creates `/i18n/translation/pl.json` with all keys from `en.json` marked `[TRANSLATE]`.

Then:

1. Add `pl: { translation: pl }` to `resources` in `i18n/index.ts`
2. Add `'pl'` to `CFBundleLocalizations` array in `app.config.js`
