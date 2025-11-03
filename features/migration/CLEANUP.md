# Migration Cleanup Guide

**Status**: ✅ Ready for cleanup after 100% migration confirmed

## Prerequisites

Before removing migration code, confirm:
- [ ] 100% of users have migrated (check analytics/usage data)
- [ ] No users still on old app versions
- [ ] Migration has been live for sufficient time (e.g., 3+ months)

## Cleanup Steps

### Step 1: Delete Migration Folder (Entire folder)

Delete the entire `features/migration/` folder:
- `features/migration/transformExerciseLog.ts`
- `features/migration/transformExerciseLog.test.ts`
- `features/migration/useMigration.ts`
- `features/migration/cleanupMigrationFlag.ts`

**Command:**
```bash
rm -rf features/migration/
```

### Step 2: Remove Migration Calls from App Routes

#### `app/index.tsx`

Remove:
- Line 11: `import { useMigration } from '../features/migration/useMigration';`
- Line 15: `const { isMigrated } = useMigration();`
- Lines 31-33: The `if (!isMigrated) return null;` guard block

#### `app/chart.tsx`

Remove:
- Line 5: `import { useMigration } from '../features/migration/useMigration';`
- Line 8: `const { isMigrated } = useMigration();`
- Lines 10-12: The `if (!isMigrated) return null;` guard block

### Step 3: Delete Old Exercise Types File

Delete: `features/EXERCISES.old.ts`

**Command:**
```bash
rm features/EXERCISES.old.ts
```

### Step 4: Optional - Cleanup Migration Flag

The `exerciseLogMigrated` flag in AsyncStorage is harmless but can be cleaned up:

**Option A**: Leave it (recommended - harmless, no impact)
**Option B**: Remove via cleanup script (run once via console or add to one-time migration)

### Step 5: Verify

After cleanup:
- [ ] Run `npm run test:run` - all tests should pass
- [ ] Run `npm run lint` - no errors
- [ ] Verify app still works in browser/native
- [ ] Check git diff shows clean deletions (no partial file edits)

## Files That Will Be Deleted (Complete)

✅ `features/migration/` - entire folder (4 files)
✅ `features/EXERCISES.old.ts` - complete file

## Files That Will Be Modified (Simple Removals)

✅ `app/index.tsx` - remove 3 lines (import, hook call, guard)
✅ `app/chart.tsx` - remove 3 lines (import, hook call, guard)

## Storage Keys

- `exerciseLog` - Already deleted during migration (automatic cleanup)
- `exerciseLogMigrated` - Optional cleanup (harmless if left)
- `exerciseLogV2` - Keep (this is the active storage key)

## Notes

- All migration code is isolated in `features/migration/` folder for easy deletion
- App routes have clear TODO comments marking exactly what to remove
- No partial file edits needed - just delete complete files/folders
- Migration flag cleanup is optional (flag is harmless if left)
