# /add-translation

Adds a translation key to all 9 language files.

## Usage

```
/add-translation [key?] [description?]
```

If parameters not provided, prompts:
- "What translation key? (use `_.` prefix for utilities)"
- "Brief description for context?"
- Then asks for translation in each language

## What it does

- Updates **ALL** language files in `/i18n/translation/` directory
  (count determined by `resources` object in `i18n/index.ts`)
- Follows key naming convention (`_.keyName` for utilities)
- Prompts for translation in each language
- Maintains JSON structure

## References

See `.cursor/rules/i18n.mdc` for:

- Translation key naming conventions
- JSON structure requirements

**Source of Truth** for languages: `i18n/index.ts` (`resources` object)

## Example

```
/add-translation _.settings "Settings page title"
```

Adds to all language files:

- `/i18n/translation/en.json`: `"_.settings": "Settings"`
- `/i18n/translation/de.json`: `"_.settings": "Einstellungen"`
- `/i18n/translation/es.json`: `"_.settings": "Configuración"`
- etc.
