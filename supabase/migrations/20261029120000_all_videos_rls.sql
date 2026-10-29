-- Vídeos del nutricionista: los gestiona desde configuración (Mis vídeos)
-- y sus clientes solo pueden verlos.

-- 1. nutri_id lo pone la base de datos: el cliente web no lo envía
alter table public.all_videos
  alter column nutri_id set default auth.uid();

create index if not exists all_videos_nutri_id_idx
  on public.all_videos (nutri_id);

alter table public.all_videos enable row level security;

-- 2. Se sustituyen todas las políticas anteriores de all_videos
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'all_videos'
  loop
    execute format('drop policy %I on public.all_videos', pol.policyname);
  end loop;
end $$;

-- 3. El nutricionista gestiona sus propios vídeos
create policy "Nutritionist manage own videos"
  on public.all_videos
  for all
  to authenticated
  using (nutri_id = (select auth.uid()))
  with check (nutri_id = (select auth.uid()));

-- 4. Los clientes ven los vídeos de su nutricionista
create policy "Client read nutritionist videos"
  on public.all_videos
  for select
  to authenticated
  using (
    nutri_id = (
      select all_users.nutri_id
      from public.all_users
      where all_users.user_id = (select auth.uid())
    )
  );
