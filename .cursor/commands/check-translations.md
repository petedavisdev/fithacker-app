# /check-translations

Verifies translation completeness across all language files.

## Usage

```
/check-translations
```

## What it checks

- Checks all 9 language files have same keys
- Reports missing translations
- Reports extra translations
- Suggests fixes

## References

See `.cursor/rules/i18n.mdc` for:

- List of all 9 supported languages
- Translation file locations
- Key naming conventions

## Example output

```
Checking translations...
(Count determined by resources in i18n/index.ts)

✅ en.json: 45 keys
❌ de.json: 44 keys (missing: _.settings)
❌ es.json: 46 keys (extra: _.unused)
✅ fr.json: 45 keys
... (etc for all languages)

Suggested fixes:
1. Add "_.settings" to de.json
2. Remove "_.unused" from es.json or add to all
```
