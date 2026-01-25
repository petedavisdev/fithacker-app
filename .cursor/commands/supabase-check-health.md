# /supabase-check-health

Checks hosted Supabase project health using MCP tools.

## Usage

```
/supabase-check-health
```

## What it does

1. Lists tables via `mcp_supabase_list_tables`
2. Checks for security issues via `mcp_supabase_get_advisors` with type "security"
3. Checks for performance issues via `mcp_supabase_get_advisors` with type "performance"
4. Shows summary and recommendations

## References

See `.cursor/rules/supabase.mdc` for patterns

