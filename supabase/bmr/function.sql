drop function if exists get_bmr(uuid);
drop function if exists get_bmr(uuid, date, date);

create or replace function get_bmr(user_uuid uuid, start_date date, end_date date)
returns numeric
security invoker
language plpgsql
as $$
declare
  peso numeric := 70.0;
  altura numeric := 170.0;
  edad numeric := 30.0;
  sexo text := 'male';
  actividad numeric := 1.4;
  birth_value numeric;
  sex_value numeric;
  nacimiento date;
  bmr numeric;
  range_start_ts timestamp;
  range_end_ts timestamp;
begin
  if start_date is null or end_date is null then
    raise exception 'start_date and end_date are required';
  end if;

  if start_date > end_date then
    raise exception 'start_date must be less than or equal to end_date';
  end if;

  range_start_ts := start_date::timestamp;
  range_end_ts := (end_date + 1)::timestamp;

  with filtered as (
    select
      measure_id,
      date::timestamp as ts,
      value::numeric as value
    from user_measures
    where user_id = user_uuid
      and measure_id in (1, 2, 3, 4, 5)
      and date <= end_date
  ), weighted_source as (
    select
      carry.measure_id,
      range_start_ts as ts,
      carry.value,
      0 as source_priority
    from (
      select distinct on (measure_id)
        measure_id,
        value
      from filtered
      where measure_id in (1, 2, 5)
        and ts < range_start_ts
      order by measure_id, ts desc
    ) as carry

    union all

    select
      measure_id,
      ts,
      value,
      1 as source_priority
    from filtered
    where measure_id in (1, 2, 5)
      and ts >= range_start_ts
  ), weighted_dedup as (
    select distinct on (measure_id, ts)
      measure_id,
      ts,
      value
    from weighted_source
    where ts < range_end_ts
    order by measure_id, ts, source_priority desc
  ), weighted_spans as (
    select
      measure_id,
      ts,
      value,
      lead(ts, 1, range_end_ts) over (partition by measure_id order by ts) as next_ts
    from weighted_dedup
  ), weighted_avg as (
    select
      measure_id,
      sum(value * extract(epoch from (next_ts - ts)))
      / nullif(sum(extract(epoch from (next_ts - ts))), 0) as avg_value
    from weighted_spans
    where ts >= range_start_ts
      and ts < range_end_ts
      and next_ts > ts
    group by measure_id
  ), latest_values as (
    select distinct on (measure_id)
      measure_id,
      value as latest_value
    from filtered
    where measure_id in (3, 4)
    order by measure_id, ts desc
  )
  select
    coalesce(w1.avg_value, peso),
    coalesce(w2.avg_value, altura),
    coalesce(w5.avg_value, actividad),
    b.latest_value,
    s.latest_value
  into
    peso,
    altura,
    actividad,
    birth_value,
    sex_value
  from (select 1) as seed
  left join weighted_avg as w1 on w1.measure_id = 1
  left join weighted_avg as w2 on w2.measure_id = 2
  left join weighted_avg as w5 on w5.measure_id = 5
  left join latest_values as b on b.measure_id = 3
  left join latest_values as s on s.measure_id = 4;

  if birth_value is not null then
    nacimiento := to_timestamp(birth_value)::date;
    edad := date_part('year', age(end_date, nacimiento));
  end if;

  if sex_value is not null then
    sexo := case sex_value
      when 1 then 'male'
      when 2 then 'female'
      else sexo
    end;
  end if;

  ----------------------------
  -- Cálculo BMR
  ----------------------------
  if sexo = 'male' then
    bmr := (10 * peso + 6.25 * altura - 5 * edad + 5) * actividad;
  elsif sexo = 'female' then
    bmr := (10 * peso + 6.25 * altura - 5 * edad - 161) * actividad;
  else
    bmr := (10 * peso + 6.25 * altura - 5 * edad - 76) * actividad;
  end if;

  return bmr;
end;
$$;

drop function if exists get_weight(uuid);
drop function if exists get_weight(uuid, date, date);

create or replace function get_weight(user_uuid uuid, start_date date, end_date date)
returns numeric
security invoker
language plpgsql
as $$
declare
  default_weight numeric := 70.0;
  user_weight numeric;
  range_start_ts timestamp;
  range_end_ts timestamp;
begin
  if start_date is null or end_date is null then
    raise exception 'start_date and end_date are required';
  end if;

  if start_date > end_date then
    raise exception 'start_date must be less than or equal to end_date';
  end if;

  range_start_ts := start_date::timestamp;
  range_end_ts := (end_date + 1)::timestamp;

  with filtered as (
    select
      date::timestamp as ts,
      value::numeric as value
    from user_measures
    where user_id = user_uuid
      and measure_id = 1
      and date <= end_date
  ), weighted_source as (
    select
      range_start_ts as ts,
      carry.value,
      0 as source_priority
    from (
      select value
      from filtered
      where ts < range_start_ts
      order by ts desc
      limit 1
    ) as carry

    union all

    select
      ts,
      value,
      1 as source_priority
    from filtered
    where ts >= range_start_ts
  ), weighted_dedup as (
    select distinct on (ts)
      ts,
      value
    from weighted_source
    where ts < range_end_ts
    order by ts, source_priority desc
  ), weighted_spans as (
    select
      ts,
      value,
      lead(ts, 1, range_end_ts) over (order by ts) as next_ts
    from weighted_dedup
  )
  select
    coalesce(
      sum(value * extract(epoch from (next_ts - ts)))
      / nullif(sum(extract(epoch from (next_ts - ts))), 0),
      default_weight
    )
  into user_weight
  from weighted_spans
  where ts >= range_start_ts
    and ts < range_end_ts
    and next_ts > ts;

  return user_weight;
end;
$$;
