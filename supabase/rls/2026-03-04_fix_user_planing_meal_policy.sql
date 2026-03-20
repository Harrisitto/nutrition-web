-- Fix for: "infinite recursion detected in policy for relation user_planing_meal"
-- Root cause: the SELECT policy for nutritionists referenced user_planing_meal inside its own USING clause.
-- Run this in Supabase SQL Editor (or as a migration).

begin;

-- Replace the recursive policy with a row-scoped policy that only references
-- other tables (user_planing, all_users) and ties access to the current row.
drop policy if exists rls_upm_select_nutri on public.user_planing_meal;

create policy rls_upm_select_nutri
on public.user_planing_meal
for select
to authenticated
using (
  exists (
    select 1
    from public.user_planing up
    join public.all_users au on au.user_id = up.user_id
    where up.id = public.user_planing_meal.planing_id
      and au.nutri_id = auth.uid()
      and au.is_nutritionist = true
  )
);

commit;

-- Optional: if you also store policy text in public.rls_policies, update it there too.
-- (This is only needed if you rely on that table as a source of truth.)
--
-- update public.rls_policies
-- set condition = $$EXISTS (
--   SELECT 1
--   FROM public.user_planing up
--   JOIN public.all_users au ON au.user_id = up.user_id
--   WHERE up.id = public.user_planing_meal.planing_id
--     AND au.nutri_id = auth.uid()
--     AND au.is_nutritionist = true
-- )$$
-- where table_name = 'user_planing_meal'
--   and policy_name = 'rls_upm_select_nutri'
--   and operation = 'SELECT';
