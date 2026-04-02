drop function if exists get_weight(uuid, date, date);

create or replace function get_weight(
  user_uuid uuid,
  start_date date,
  end_date date
)
returns numeric
language plpgsql
security invoker
as $$
declare
  default_weight numeric := 70.0;

  range_start_ts timestamp := start_date::timestamp;
  range_end_ts   timestamp := (end_date + 1)::timestamp;

  v_before_value numeric;
  v_before_ts     timestamp;

  v_after_value  numeric;
  v_after_ts      timestamp;

  v_sum_weight numeric;
  v_sum_seconds numeric;

begin
  if start_date is null or end_date is null then
    raise exception 'start_date and end_date are required';
  end if;

  if start_date > end_date then
    raise exception 'start_date must be <= end_date';
  end if;

  --------------------------------------------------------------------
  -- 1. Obtener último valor ANTES del rango
  --------------------------------------------------------------------
  select um.value::numeric, um.date::timestamp
  into v_before_value, v_before_ts
  from user_measures um
  where um.user_id = user_uuid
    and um.measure_id = 1
    and um.date < start_date
  order by um.date desc
  limit 1;

  --------------------------------------------------------------------
  -- 2. Obtener primer valor DESPUÉS del rango
  --------------------------------------------------------------------
  select um.value::numeric, um.date::timestamp
  into v_after_value, v_after_ts
  from user_measures um
  where um.user_id = user_uuid
    and um.measure_id = 1
    and um.date > end_date
  order by um.date asc
  limit 1;

  --------------------------------------------------------------------
  -- 3. Promedio ponderado dentro del rango
  --------------------------------------------------------------------
  with cleaned as (
      select
        um.date::timestamp as ts,
        um.value::numeric as val
      from user_measures um
      where um.user_id = user_uuid
        and um.measure_id = 1
        and um.date between start_date and end_date
      order by um.date
  ), spans as (
      select
        ts,
        val,
        lead(ts, 1, range_end_ts) over (order by ts) as next_ts
      from cleaned
  )
  select
    sum(val * extract(epoch from (next_ts - ts))),
    sum(extract(epoch from (next_ts - ts)))
  from spans
  into v_sum_weight, v_sum_seconds;

  if v_sum_seconds > 0 then
    return v_sum_weight / v_sum_seconds;
  end if;

  --------------------------------------------------------------------
  -- 4. Resolver con before/after
  --------------------------------------------------------------------

  if v_before_value is not null and v_after_value is not null then
    return v_before_value +
      (
        (v_after_value - v_before_value)
        * extract(epoch from (range_start_ts - v_before_ts))
        / extract(epoch from (v_after_ts - v_before_ts))
      );
  end if;

  if v_before_value is not null then
    return v_before_value;
  end if;

  if v_after_value is not null then
    return v_after_value;
  end if;

  --------------------------------------------------------------------
  -- 5. Sin datos → devolver por defecto
  --------------------------------------------------------------------
  return default_weight;
end;
$$