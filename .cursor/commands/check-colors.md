# /check-colors

Verifies color usage in current file against approved palette.

## Usage

```
/check-colors
```

## What it checks

- Lists all colors used
- Checks against approved palette
- Suggests replacements for non-standard colors
- Reports shadow/border color mismatches

## References

See `.cursor/rules/styling.mdc` for:

- Shadow/border pairing rules
- Color semantics (date categories)

**Source of Truth**: `tailwind.config.js` (`theme.colors`) - only these colors are available

## Example output

```
Colors found in features/Chart/ChartDay.tsx:

✅ text-yellow-500 (approved)
✅ text-cyan-500 (approved)
✅ text-pink-500 (approved)
✅ bg-[#112] (approved background)
❌ text-blue-400 (not in palette)
   → Suggest: text-cyan-400

⚠️  Mismatch detected:
   border-yellow-600 with shadow-yellow-500
   → Should be: shadow-yellow-700
```

**Reference examples**:

- `features/Chart/ChartDay.tsx` for date color patterns
- `features/Checklist/ChecklistInput.tsx` for button colors
- `app/index.tsx` for layout colors
