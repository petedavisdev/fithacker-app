-- Drop shared_buddy_data view
DROP VIEW IF EXISTS "public"."shared_buddy_data";

-- Drop followed_buddies table (triggers will be dropped automatically)
DROP TABLE IF EXISTS "public"."followed_buddies";

-- Drop user_settings table (triggers will be dropped automatically)
DROP TABLE IF EXISTS "public"."user_settings";

-- Drop sanitize_exercises function
DROP FUNCTION IF EXISTS "public"."sanitize_exercises"(jsonb);
