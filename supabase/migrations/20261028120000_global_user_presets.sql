-- Presets globales: user_id null y nutri_id = nutricionista que los crea.
-- Se gestionan desde configuración y aparecen en la planificación de todos
-- los clientes de ese nutricionista, junto a los presets propios del cliente.
-- Los presets son una herramienta del nutricionista: los clientes no tienen acceso.

-- 1. Columnas
alter table public.user_preset
  alter column user_id drop not null;

alter table public.user_preset
  add column nutri_id uuid
    default auth.uid()
    references public.all_nutritionist (nutri_id) on delete cascade;

-- 2. Presets existentes: dueño = nutricionista actual del cliente
update public.user_preset up
set nutri_id = au.nutri_id
from public.all_users au
where au.user_id = up.user_id
  and up.nutri_id is null;

-- Presets de clientes sin nutricionista: ya nadie puede acceder a ellos
delete from public.user_preset_meal upm
using public.user_preset up
where upm.preset_id = up.id
  and up.nutri_id is null;

delete from public.user_preset
where nutri_id is null;

alter table public.user_preset
  alter column nutri_id set not null;

create index user_preset_global_nutri_id_idx
  on public.user_preset (nutri_id)
  where user_id is null;

-- 3. user_preset: presets de mis clientes o mis presets globales
drop policy if exists "Nutritionist manage user_preset" on public.user_preset;

create policy "Nutritionist manage user_preset"
  on public.user_preset
  for all
  to authenticated
  using (
    user_id in (
      select all_users.user_id
      from public.all_users
      where all_users.nutri_id = (select auth.uid())
    )
    or (
      user_id is null
      and nutri_id = (select auth.uid())
    )
  )
  with check (
    user_id in (
      select all_users.user_id
      from public.all_users
      where all_users.nutri_id = (select auth.uid())
    )
    or (
      user_id is null
      and nutri_id = (select auth.uid())
    )
  );

-- 4. user_preset_meal: mismo acceso que el preset al que pertenece.
-- Sin `up.user_id = auth.uid()`: los clientes no tienen acceso a los presets.
drop policy if exists "Nutritionist manage user_preset_meal" on public.user_preset_meal;

create policy "Nutritionist manage user_preset_meal"
  on public.user_preset_meal
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.user_preset up
      left join public.all_users au on up.user_id = au.user_id
      where up.id = user_preset_meal.preset_id
        and (
          au.nutri_id = (select auth.uid())
          or (
            up.user_id is null
            and up.nutri_id = (select auth.uid())
          )
        )
    )
  )
  with check (
    exists (
      select 1
      from public.user_preset up
      left join public.all_users au on up.user_id = au.user_id
      where up.id = user_preset_meal.preset_id
        and (
          au.nutri_id = (select auth.uid())
          or (
            up.user_id is null
            and up.nutri_id = (select auth.uid())
          )
        )
    )
  );
