# /new-feature

Creates a new feature folder with complete boilerplate structure.

## Usage

```
/new-feature [feature-name?] [component-name?]
```

If no feature name provided, prompts: "What feature? (e.g., Analytics, Settings)"
If no component name, uses feature name as component name.

## What it creates

- Feature folder in `/features/[feature-name]/`
- Main component: `[ComponentName].tsx`
- Test file: `[ComponentName].test.tsx`
- Helper function file: `get[FeatureName]Data.ts`
- Helper test file: `get[FeatureName]Data.test.ts`
- Follows all conventions: co-location, naming, TypeScript patterns
- Uses proper imports and structure

## References

See `.cursor/rules/architecture.mdc` for:

- Feature-based structure requirements
- File naming conventions
- Co-location rules

See `.cursor/rules/typescript.mdc` for:

- Type patterns to use
- Strict typing requirements

See `.cursor/rules/testing.mdc` for:

- Test file structure
- Mock patterns

See `.cursor/rules/react-components.mdc` for:

- Component function declarations
- Hook patterns

## Example

```
/new-feature Analytics AnalyticsChart
```

Creates:

- `/features/Analytics/AnalyticsChart.tsx`
- `/features/Analytics/AnalyticsChart.test.tsx`
- `/features/Analytics/getAnalyticsData.ts`
- `/features/Analytics/getAnalyticsData.test.ts`
