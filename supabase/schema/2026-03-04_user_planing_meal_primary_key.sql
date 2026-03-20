-- Change primary key for public.user_planing_meal to exclude type_id.
-- This drops the existing PRIMARY KEY (whatever its name is) and recreates it as (planing_id, meal_id).
-- Run in Supabase SQL editor (or as a migration).

begin;

-- Drop current primary key constraint (name can vary), if any.
do $$
declare
  pk_name text;
begin
  select c.conname
    into pk_name
  from pg_constraint c
  join pg_class t on t.oid = c.conrelid
  join pg_namespace n on n.oid = t.relnamespace
  where n.nspname = 'public'
    and t.relname = 'user_planing_meal'
    and c.contype = 'p'
  limit 1;

  if pk_name is not null then
    execute format('alter table public.user_planing_meal drop constraint %I', pk_name);
  end if;
end
$$;

-- Recreate primary key without type_id.
-- If you already have duplicates on (planing_id, meal_id), this will fail until you clean them up.
alter table public.user_planing_meal
  add constraint user_planing_meal_pkey primary key (planing_id, meal_id);

commit;
