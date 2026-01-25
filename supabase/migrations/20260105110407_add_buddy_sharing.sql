-- Create update_updated_at_column function (if it doesn't exist)
CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"()
RETURNS "trigger"
LANGUAGE "plpgsql"
SECURITY DEFINER
SET "search_path" TO 'public'
AS $$
BEGIN
    NEW."updated_at" = now();
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";

-- Create user_settings table
CREATE TABLE IF NOT EXISTS "public"."user_settings" (
    "user_id" "uuid" NOT NULL PRIMARY KEY,
    "share_token" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."user_settings" OWNER TO "postgres";

ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

CREATE UNIQUE INDEX IF NOT EXISTS "user_settings_share_token_idx" ON "public"."user_settings"("share_token") WHERE "share_token" IS NOT NULL;

CREATE POLICY "Users can view own settings" ON "public"."user_settings" 
    FOR SELECT TO "authenticated" 
    USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Users can insert own settings" ON "public"."user_settings" 
    FOR INSERT TO "authenticated" 
    WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Users can update own settings" ON "public"."user_settings" 
    FOR UPDATE TO "authenticated" 
    USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

ALTER TABLE "public"."user_settings" ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER "update_user_settings_updated_at" 
    BEFORE UPDATE ON "public"."user_settings" 
    FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

-- Create followed_buddies table
CREATE TABLE IF NOT EXISTS "public"."followed_buddies" (
    "user_id" "uuid" NOT NULL,
    "buddy_token" "uuid" NOT NULL,
    "nickname" text NOT NULL,
    "is_pinned" boolean DEFAULT false NOT NULL,
    "view_count" integer DEFAULT 0 NOT NULL,
    "last_viewed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    PRIMARY KEY ("user_id", "buddy_token")
);

ALTER TABLE "public"."followed_buddies" OWNER TO "postgres";

ALTER TABLE ONLY "public"."followed_buddies"
    ADD CONSTRAINT "followed_buddies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

CREATE POLICY "Users can manage own buddies" ON "public"."followed_buddies" 
    FOR ALL TO "authenticated" 
    USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

ALTER TABLE "public"."followed_buddies" ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER "update_followed_buddies_updated_at" 
    BEFORE UPDATE ON "public"."followed_buddies" 
    FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

-- Create sanitize_exercises function
CREATE OR REPLACE FUNCTION "public"."sanitize_exercises"(input_json jsonb)
RETURNS jsonb AS $$
BEGIN
    -- If input is null or empty, return empty array
    IF input_json IS NULL OR jsonb_array_length(input_json) = 0 THEN
        RETURN '[]'::jsonb;
    END IF;
    
    -- Extract exercise type (first element if array, otherwise the value itself)
    RETURN (
        SELECT jsonb_agg(
            CASE 
                WHEN jsonb_typeof(e) = 'array' THEN e->0 
                ELSE e 
            END
        )
        FROM jsonb_array_elements(input_json) AS e
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER SET search_path TO 'public';

ALTER FUNCTION "public"."sanitize_exercises"(jsonb) OWNER TO "postgres";

-- Create shared_buddy_data view
-- Note: This view depends on exercise_logs table which should already exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercise_logs') THEN
        EXECUTE '
        CREATE OR REPLACE VIEW "public"."shared_buddy_data" AS
        SELECT 
            us.share_token, 
            el.day, 
            public.sanitize_exercises(el.log) AS exercises
        FROM public.exercise_logs el
        JOIN public.user_settings us ON us.user_id = el.user_id
        WHERE us.share_token IS NOT NULL';
        
        EXECUTE 'ALTER TABLE "public"."shared_buddy_data" OWNER TO "postgres"';
        EXECUTE 'GRANT SELECT ON "public"."shared_buddy_data" TO "anon"';
        EXECUTE 'GRANT SELECT ON "public"."shared_buddy_data" TO "authenticated"';
    END IF;
END $$;
