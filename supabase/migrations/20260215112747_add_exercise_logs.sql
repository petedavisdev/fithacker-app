create table "public"."exercise_logs" (
    "user_id" uuid not null,
    "day" date not null,
    "log" jsonb not null,
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."exercise_logs" enable row level security;

CREATE UNIQUE INDEX exercise_logs_pkey ON public.exercise_logs USING btree (user_id, day);

alter table "public"."exercise_logs" add constraint "exercise_logs_pkey" PRIMARY KEY using index "exercise_logs_pkey";

alter table "public"."exercise_logs" add constraint "exercise_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."exercise_logs" validate constraint "exercise_logs_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

grant delete on table "public"."exercise_logs" to "anon";

grant insert on table "public"."exercise_logs" to "anon";

grant references on table "public"."exercise_logs" to "anon";

grant select on table "public"."exercise_logs" to "anon";

grant trigger on table "public"."exercise_logs" to "anon";

grant truncate on table "public"."exercise_logs" to "anon";

grant update on table "public"."exercise_logs" to "anon";

grant delete on table "public"."exercise_logs" to "authenticated";

grant insert on table "public"."exercise_logs" to "authenticated";

grant references on table "public"."exercise_logs" to "authenticated";

grant select on table "public"."exercise_logs" to "authenticated";

grant trigger on table "public"."exercise_logs" to "authenticated";

grant truncate on table "public"."exercise_logs" to "authenticated";

grant update on table "public"."exercise_logs" to "authenticated";

grant delete on table "public"."exercise_logs" to "service_role";

grant insert on table "public"."exercise_logs" to "service_role";

grant references on table "public"."exercise_logs" to "service_role";

grant select on table "public"."exercise_logs" to "service_role";

grant trigger on table "public"."exercise_logs" to "service_role";

grant truncate on table "public"."exercise_logs" to "service_role";

grant update on table "public"."exercise_logs" to "service_role";


  create policy "Users can delete own exercise logs"
  on "public"."exercise_logs"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can insert exercise logs"
  on "public"."exercise_logs"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can update own exercise logs"
  on "public"."exercise_logs"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can view own exercise logs"
  on "public"."exercise_logs"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


CREATE TRIGGER update_exercise_logs_updated_at BEFORE UPDATE ON public.exercise_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

