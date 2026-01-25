#!/bin/bash
set -e

# Deploy auth email templates to Supabase using the Management API
#
# Required environment variables:
#   SUPABASE_ACCESS_TOKEN - Get from https://supabase.com/dashboard/account/tokens
#   SUPABASE_PROJECT_REF  - Your project reference (e.g., eujlarqrbwllnmxlhbsk)
#
# Usage:
#   npm run supabase:templates:deploy
#
# Note: This requires a custom SMTP provider to be configured in Supabase.

SUPABASE_ACCESS_TOKEN="${SUPABASE_ACCESS_TOKEN:?Missing SUPABASE_ACCESS_TOKEN - get from https://supabase.com/dashboard/account/tokens}"
PROJECT_REF="${SUPABASE_PROJECT_REF:?Missing SUPABASE_PROJECT_REF - your project reference}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TEMPLATE_FILE="$PROJECT_DIR/supabase/templates/auth-email.html"

if [ ! -f "$TEMPLATE_FILE" ]; then
  echo "Error: Template file not found at $TEMPLATE_FILE"
  exit 1
fi

echo "Reading email template..."
TEMPLATE_BODY=$(cat "$TEMPLATE_FILE" | jq -Rs .)

SUBJECT="Your magic number ✨ FITHACKER 🚶🏃‍♀️🤸💪🌴🦵"

echo "Deploying email templates to Supabase project: $PROJECT_REF"

RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"mailer_subjects_magic_link\": \"$SUBJECT\",
    \"mailer_templates_magic_link_content\": $TEMPLATE_BODY,
    \"mailer_subjects_confirmation\": \"$SUBJECT\",
    \"mailer_templates_confirmation_content\": $TEMPLATE_BODY
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
  echo "✅ Email templates deployed successfully"
else
  echo "❌ Failed to deploy email templates (HTTP $HTTP_CODE)"
  echo "$BODY"
  exit 1
fi
