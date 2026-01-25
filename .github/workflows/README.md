# GitHub Actions Workflows

## PR Checks

The `pr-checks.yml` workflow runs on every pull request to `main` and on pushes to `main`.

### What it checks

1. **Supabase types are in sync** - Regenerates types and verifies they match committed version
2. **Code linting** - Runs ESLint
3. **Tests** - Runs Jest test suite
4. **Code formatting** - Checks Prettier formatting (doesn't modify files)
5. **Schema drift** - Shows differences between schema and production (informational only)

### Required Secrets

The following secrets must be configured in your GitHub repository settings:

#### `SUPABASE_ACCESS_TOKEN`

Required for:

- Generating TypeScript types from production database
- Checking schema drift

**How to get the token:**

1. Log in to Supabase CLI locally:

   ```bash
   npx supabase login
   ```

2. Get your access token:

   ```bash
   cat ~/.supabase/access-token
   ```

3. Add to GitHub:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `SUPABASE_ACCESS_TOKEN`
   - Value: Paste the token from step 2
   - Click "Add secret"

**Alternative:** Generate a new access token at https://supabase.com/dashboard/account/tokens

### Workflow Behavior

- **On PR**: All checks must pass before merge
- **On push to main**: Runs checks to ensure main stays healthy
- **Format check**: Fails if code isn't formatted (run `npm run format` locally)
- **Type verification**: Fails if `database.types.ts` is out of sync with schema
- **Schema drift**: Always passes (informational only)

### Local Development

Run the same checks locally before pushing:

```bash
npm run checks
```

This runs all checks except `format:check` (it runs `format` which auto-fixes).

### Troubleshooting

**"database.types.ts is out of sync"**

- Run `npm run supabase:types` locally
- Commit the updated `database.types.ts`

**"Files are not formatted"**

- Run `npm run format` locally
- Commit the formatted files

**"Schema drift detected"**

- This is informational only and won't block PRs
- If unexpected, check if someone changed the database directly
- Update `supabase/schemas/schema.sql` to match production, then generate migration: `npm run supabase:schema:diff <name>`

## Production Deployment

The `deploy-production.yml` workflow automatically deploys web to production when code is pushed to `main`.

### Important: Schema Deployment is Manual

**Database schema migrations are NOT automated** and must be deployed manually before code deployment.

### Deployment Workflow

**Declarative Schema Approach**: Edit `schema.sql` (desired state) → Generate migrations → Deploy

1. **Schema changes** (if any):
   - Edit `supabase/schemas/schema.sql` in feature branch (desired database state)
   - Generate migration: `npm run supabase:schema:diff <migration-name>`
   - **Review the generated migration** before committing
   - Test locally or use Supabase preview branches
   - PR reviewed and merged to `main`

2. **Before code deployment**:

   ```bash
   # Check for schema changes (informational)
   npm run supabase:db:diff

   # Deploy schema if needed (pushes migrations + regenerates types)
   npm run deploy:schema
   ```

3. **Code deployment**:
   - Push to `main` → GitHub Actions automatically deploys web
   - Or deploy manually: `npm run deploy:prod`

### Required Secrets

- `SUPABASE_ACCESS_TOKEN` - For schema checks (already configured)
- `EXPO_TOKEN` - For EAS deployments (get from https://expo.dev/accounts/[account]/settings/access-tokens)

### Skip Deployment

To skip automatic deployment, include `[skip deploy]` in your commit message:

```bash
git commit -m "Update docs [skip deploy]"
```

### Troubleshooting Deployment

**"Deployment failed"**

- Check if schema was deployed first (required)
- Verify `EXPO_TOKEN` secret is configured
- Check EAS build logs for errors
