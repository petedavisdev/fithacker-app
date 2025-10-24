# /this-i18n

Adds i18n to currently open file.

## Usage

```
/this-i18n
```

## What it does

- Finds hard-coded strings
- Suggests translation keys
- Adds useTranslation hook
- Wraps strings in t()

## References

See `.cursor/rules/i18n.mdc` for:

- Translation key naming conventions
- useTranslation hook usage
- What strings to translate (skip emojis, technical strings)

## Example Transformation

### Before

```tsx
function Component() {
  return (
    <View>
      <Text>Today</Text>
      <Text>What exercises did you do?</Text>
    </View>
  );
}
```

### After

```tsx
import { useTranslation } from "react-i18next";

function Component() {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t("_.today")}</Text>
      <Text>{t("_.whatExerciseToday")}</Text>
    </View>
  );
}
```

## Translation Key Suggestions

Command will suggest keys based on content:

- "Today" → `_.today`
- "Settings" → `_.settings`
- "What exercises..." → `_.whatExerciseToday`

Then prompts to add keys to all 9 language files.

## Skips

- Already translated strings (wrapped in `t()`)
- Technical strings (IDs, keys, etc.)
- Emojis (they are the keys!)
