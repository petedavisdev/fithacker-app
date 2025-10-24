# /check-dependencies

Analyzes feature dependencies.

## Usage

```
/check-dependencies [feature-name?]
```

If no feature provided:
- Detects feature from currently open file, or
- Lists all features and prompts: "Which feature to analyze?"

## What it shows

- Shows what imports from where
- Identifies circular dependencies
- Suggests better organization
- Creates dependency graph

## References

See `.cursor/rules/architecture.mdc` for:

- Import organization rules
- Feature-based structure expectations
- Path alias usage (@/)

## Example

```
/check-dependencies Chart
```

Output:

```
Dependency analysis for features/Chart/

Imports from:
- features/EXERCISES.ts (ExerciseLog type)
- features/dateInfo.ts (getDate, getLastMonday)
- expo-router (Link, useLocalSearchParams)
- react-i18next (useTranslation)

Imported by:
- app/chart.tsx

Internal dependencies:
- Chart.tsx → ChartWeek.tsx
- Chart.tsx → getChartData.ts
- ChartDay.tsx → dateInfo.ts

✅ No circular dependencies detected

Dependency graph:
app/chart.tsx
  └─ Chart.tsx
      ├─ ChartWeek.tsx
      │   └─ ChartDay.tsx
      └─ getChartData.ts
```
