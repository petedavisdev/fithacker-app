# /supabase-deploy-schema

Generates migration from schema changes, deploys to hosted Supabase, and regenerates TypeScript types.

## Usage

```
/supabase-deploy-schema [migration-name?]
```

Prompts for migration name if not provided.

## What it does

1. Runs `supabase db diff -f <migration-name>` (if using Supabase CLI)
2. Shows generated migration
3. Uses MCP tool `mcp_supabase_apply_migration` to deploy directly to hosted Supabase
4. Uses MCP tool `mcp_supabase_generate_typescript_types` to regenerate types
5. Saves types to `features/supabase/database.types.ts`

## References

See `.cursor/rules/supabase.mdc` for patterns

