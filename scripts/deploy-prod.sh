#!/bin/bash
# Production deployment script
# Ensures database schema is deployed before code
#
# Schema Management:
# - Uses declarative schema approach: edit supabase/schemas/schema.sql
# - Generate migrations: npm run supabase:schema:diff <name>
# - Deploy: npm run deploy:schema (pushes migrations + regenerates types)

set -e  # Exit on error

echo "🚀 Starting production deployment..."
echo ""

# Check if Supabase is linked
if ! npx supabase projects list > /dev/null 2>&1; then
    echo "❌ Error: Supabase CLI not authenticated"
    echo "   Run: npm run supabase:login"
    exit 1
fi

# Step 1: Check for schema changes
echo "📊 Checking for schema changes..."
echo ""
SCHEMA_DIFF=$(npx supabase db diff --linked 2>&1 | grep -E "^(create|alter|drop|CREATE|ALTER|DROP)" || true)

if [ -n "$SCHEMA_DIFF" ]; then
    echo "⚠️  Schema changes detected:"
    echo ""
    echo "$SCHEMA_DIFF" | head -20
    echo ""
    echo "📝 Full diff:"
    npx supabase db diff --linked
    echo ""
    read -p "❓ Apply schema changes to production? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled. Schema must be deployed first."
        echo "   To deploy schema manually: npm run deploy:schema"
        exit 1
    fi
    
    echo "📊 Deploying schema to production..."
    npm run deploy:schema
    if [ $? -ne 0 ]; then
        echo "❌ Schema deployment failed!"
        exit 1
    fi
    echo "✅ Schema deployed successfully (migrations pushed + types regenerated)"
    echo ""
else
    echo "✅ No schema changes detected"
    echo ""
fi

# Step 2: Deploy code
echo "🚀 Deploying code to production..."
echo ""

# Check which platform to deploy
read -p "❓ Deploy web? (Y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo "🌐 Building and deploying web..."
    npm run web:prod
    echo "✅ Web deployment complete"
fi

echo ""
echo "✅ Production deployment complete!"
echo ""

