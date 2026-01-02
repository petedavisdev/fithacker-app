# /supabase-deploy-schema

Generates migration from schema changes (declarative schema approach), deploys to hosted Supabase, and regenerates TypeScript types.

## Usage

```
/supabase-deploy-schema [migration-name?]
```

Prompts for migration name if not provided.

## What it does

1. Compares `supabase/schemas/schema.sql` (single source of truth) against remote database
2. Runs `supabase db diff --linked -f <migration-name>` to generate migration
3. Shows generated migration
4. Uses MCP tool `mcp_supabase_apply_migration` to deploy directly to hosted Supabase
5. Uses MCP tool `mcp_supabase_generate_typescript_types` to regenerate types
6. Saves types to `shared/supabase/database.types.ts`

## Schema Workflow

- **Edit schema**: Modify `supabase/schemas/schema.sql` directly
- **Generate migration**: This command creates a migration from the diff
- **With branching**: Migrations are automatically applied to branch environments
- **Pull latest**: Use `npm run supabase:schema:pull` to sync schema from production

## References

See `.cursor/rules/supabase.mdc` for patterns

