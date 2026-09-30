-- Guarda las kcal de entrenamiento de un día y vuelve a elegir el recipe_type
-- de las comidas de p_changable_meal_ids. Tiene dos modos:
--
--   - Ajuste (p_target_kcal = null): las kcal de las comidas siguen el cambio
--     de kcal de entrenamiento (nuevo - anterior).
--   - Día entero (p_target_kcal informado): las comidas del día tienen que
--     sumar p_target_kcal. Las comidas de p_changable_meal_ids que aún no
--     existen se insertan, así se pueden generar días vacíos.
--
-- Los tipos candidatos de cada comida son los que este usuario ha tenido en esa
-- misma comida durante el último mes, así un desayuno solo recibe tipos de
-- desayuno. Si la comida ya existe, su tipo actual también es candidato
-- ("mantener"). Una comida sin historial ni tipo actual no se genera.
--
-- Muestreo: en vez de listar todas las combinaciones se generan v_samples
-- combinaciones al azar. En cada una, el tipo de cada comida se elige con
-- probabilidad proporcional a sus usos, inclinada hacia más o menos kcal con
-- un factor aleatorio por muestra (v_max_tilt). Sin esa inclinación las
-- muestras se quedan cerca del día habitual y un objetivo alejado (un día de
-- entrenamiento) nunca se alcanza aunque sea posible. Solo son válidas las combinaciones que
-- cambian al menos una comida y cuya diferencia de kcal está a ±v_margin_kcal
-- de la diferencia objetivo; entre ellas se elige una al azar con probabilidad
-- proporcional a los usos medios por comida cambiada, para que cambiar más
-- comidas no gane solo por sumar más usos. En modo día entero, si ninguna
-- entra en el margen se usa la más cercana al objetivo en vez de no hacer nada.
--
-- p_seed alimenta setseed(): la misma semilla repite el resultado y una
-- semilla distinta genera otra combinación.
--
-- Coste: O(v_samples · ∑ (c_i + 1)) filas, donde c_i son los tipos distintos
-- del historial de la comida i. Es lineal en el número de comidas en vez de
-- exponencial. Peor caso con 10 comidas y 22 tipos: 10.000 · 10 · 22 ≈ 2,2·10^6
-- filas -> ~1,3 s. Más muestras dan más probabilidad de encontrar la mejor
-- combinación a cambio de más coste; no subir mucho más, Supabase corta las
-- consultas del rol authenticated a los 8 s (statement_timeout).
--
-- Al insertar o actualizar type_id, el trigger de recetas elige una receta
-- nueva. En el `on conflict` se usa excluded.recipe_id porque EXCLUDED ya
-- lleva la receta que puso el trigger BEFORE INSERT.
-- security invoker para que RLS siga decidiendo quién puede editar la
-- planificación de cada usuario.

drop function if exists public.generate_meal_types_for_day(uuid, date, integer, bigint[], integer);
drop function if exists public.generate_meal_types_for_day(uuid, date, integer, bigint[], integer, integer);

create or replace function public.generate_meal_types_for_day(
  p_user_id uuid,
  p_date date,
  p_training_kcal integer,
  p_changable_meal_ids bigint[],
  p_seed integer,
  p_target_kcal integer default null
)
returns setof public.user_planing_meal
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_margin_kcal constant integer := 100;
  v_history_days constant integer := 30;
  v_samples constant integer := 10000;
  v_max_tilt constant double precision := 2;
  v_old_training_kcal integer;
  v_current_kcal integer;
  v_target_delta integer;
  v_meal_ids bigint[];
  v_type_ids bigint[];
begin
  if p_user_id is null then
    raise exception 'User ID is required';
  end if;

  -- setseed espera un valor en [-1, 1]; hace que el muestreo sea repetible.
  perform setseed((p_seed % 2147483647)::double precision / 2147483647);

  -- kcal de entrenamiento antes del cambio.
  select up.training_kcal
  into v_old_training_kcal
  from public.user_planing up
  where up.user_id = p_user_id and up.date = p_date;

  -- kcal actuales de todas las comidas del día, cambiables o no.
  select coalesce(sum(rt.kcal), 0)
  into v_current_kcal
  from public.user_planing_meal upm
  join public.recipe_type rt on rt.id = upm.type_id
  where upm.user_id = p_user_id and upm.date = p_date;

  -- kcal que las comidas tienen que añadir o quitar.
  if p_target_kcal is null then
    v_target_delta := p_training_kcal - coalesce(v_old_training_kcal, 0);
  else
    v_target_delta := p_target_kcal - v_current_kcal;
  end if;

  -- Guardar kcal de entrenamiento y crear fila si no existía.
  -- Asi los usuarios tambien pueden generar sus propias planificaciones.
  insert into public.user_planing (user_id, date, training_kcal)
  values (p_user_id, p_date, p_training_kcal)
  on conflict (user_id, date) do update
  set training_kcal = excluded.training_kcal;

  with
  -- Comidas cambiables, existan o no ese día, con su tipo y kcal actuales.
  meals as (
    select
      mid.meal_id,
      upm.type_id as current_type_id,
      coalesce(rt.kcal, 0) as current_kcal
    from unnest(p_changable_meal_ids) as mid(meal_id)
    left join public.user_planing_meal upm
      on upm.user_id = p_user_id
      and upm.date = p_date
      and upm.meal_id = mid.meal_id
    left join public.recipe_type rt on rt.id = upm.type_id
  ),
  -- Cuántas veces se usó cada tipo en cada comida cambiable el último mes.
  usage as (
    select upm.meal_id, upm.type_id, count(*) as uses
    from public.user_planing_meal upm
    where upm.user_id = p_user_id
      and upm.meal_id = any(p_changable_meal_ids)
      and upm.date >= p_date - v_history_days
      and upm.date < p_date
    group by upm.meal_id, upm.type_id
  ),
  -- Por comida: los tipos de su historial, más el tipo actual si no aparece
  -- en él (con peso 1) para que "mantener" siempre sea posible.
  options as (
    select
      m.meal_id,
      u.type_id,
      rt.kcal - m.current_kcal as kcal_delta,
      u.uses,
      u.type_id is distinct from m.current_type_id as changed
    from meals m
    join usage u on u.meal_id = m.meal_id
    join public.recipe_type rt on rt.id = u.type_id
    union all
    select m.meal_id, m.current_type_id, 0, 1::bigint, false
    from meals m
    where m.current_type_id is not null
      and not exists (
        select 1 from usage u
        where u.meal_id = m.meal_id and u.type_id = m.current_type_id
      )
  ),
  -- Cada muestra lleva una inclinación aleatoria en [-v_max_tilt, v_max_tilt].
  -- Sin ella todas las muestras se concentran alrededor del día habitual y
  -- los objetivos lejanos (p. ej. días de entrenamiento) nunca se alcanzan.
  samples as (
    select s.sample, (random() * 2 - 1) * v_max_tilt as tilt
    from generate_series(1, v_samples) as s(sample)
  ),
  -- Una elección por (muestra, comida), con peso usos · e^(tilt · kcal/100):
  -- una inclinación positiva favorece los tipos con más kcal y una negativa
  -- los de menos. Se usa el truco de Gumbel (ln(peso) + ruido) en escala
  -- logarítmica para que los pesos extremos no desborden.
  picks as (
    select distinct on (s.sample, o.meal_id)
      s.sample, o.meal_id, o.type_id, o.kcal_delta, o.uses, o.changed
    from samples s
    cross join options o
    order by
      s.sample,
      o.meal_id,
      ln(o.uses) + s.tilt * o.kcal_delta / 100.0
        - ln(-ln(greatest(random(), 1e-15))) desc
  ),
  -- Una fila por muestra. Solo se guardan las comidas que cambian.
  combos as (
    select
      p.sample,
      array_agg(p.meal_id order by p.meal_id) filter (where p.changed) as meal_ids,
      array_agg(p.type_id order by p.meal_id) filter (where p.changed) as type_ids,
      sum(p.kcal_delta) as kcal_delta,
      coalesce(sum(p.uses) filter (where p.changed), 0) as uses,
      count(*) filter (where p.changed) as changed
    from picks p
    group by p.sample
  )
  select c.meal_ids, c.type_ids
  into v_meal_ids, v_type_ids
  from combos c
  where c.changed >= 1
    and (
      p_target_kcal is not null
      or abs(c.kcal_delta - v_target_delta) <= v_margin_kcal
    )
  order by
    -- Primero las que entran en el margen.
    abs(c.kcal_delta - v_target_delta) <= v_margin_kcal desc,
    -- Elección aleatoria ponderada entre las válidas: el peso son los usos
    -- por comida cambiada, para que todos los tamaños compitan en igualdad.
    case
      when abs(c.kcal_delta - v_target_delta) <= v_margin_kcal
      then power(random(), c.changed::double precision / c.uses)
    end desc nulls last,
    -- Si ninguna entra en el margen (solo en modo día entero), la más cercana.
    abs(c.kcal_delta - v_target_delta)
  limit 1;

  -- Solo se escriben las comidas cuyo tipo cambia (o que no existían), para
  -- que el trigger de recetas no cambie la receta de las que se quedan igual.
  insert into public.user_planing_meal (user_id, date, meal_id, type_id)
  select p_user_id, p_date, s.meal_id, s.type_id
  from unnest(v_meal_ids, v_type_ids) as s(meal_id, type_id)
  on conflict (user_id, date, meal_id) do update
  set type_id = excluded.type_id,
      recipe_id = excluded.recipe_id;

  return query
  select upm.*
  from public.user_planing_meal upm
  where upm.user_id = p_user_id and upm.date = p_date;
end;
$$;

grant execute on function public.generate_meal_types_for_day(uuid, date, integer, bigint[], integer, integer) to authenticated;
