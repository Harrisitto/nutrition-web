drop function if exists get_bmr(uuid, date, date);

create or replace function get_bmr(
  user_uuid uuid,
  start_date date,
  end_date date
)
returns numeric
language plpgsql
security invoker
as $$
declare
  peso numeric := 70.0;
  altura numeric := 170.0;
  actividad numeric := 1.4;

  nacimiento date;
  edad numeric := 30.0;
  sexo text := 'male';

  v_measure_id int;
  before_value numeric;
  after_value numeric;
  before_ts timestamp;
  after_ts timestamp;
  v_sum numeric;
  v_sec numeric;

  range_start_ts timestamp := start_date::timestamp;
  range_end_ts   timestamp := (end_date + 1)::timestamp;

  bmr numeric;
begin
  if start_date is null or end_date is null then
    raise exception 'start_date and end_date are required';
  end if;

  if start_date > end_date then
    raise exception 'start_date must be <= end_date';
  end if;

  --------------------------------------------------------------------
  -- 1. PESO, ALTURA Y ACTIVIDAD (medidas 1,2,5)
  --------------------------------------------------------------------
  for v_measure_id in select unnest(array[1,2,5])
  loop
    -- BEFORE
    select um.value::numeric, um.date::timestamp
    into before_value, before_ts
    from user_measures um
    where um.user_id = user_uuid
      and um.measure_id = v_measure_id
      and um.date < start_date
    order by um.date desc
    limit 1;

    -- AFTER
    select um.value::numeric, um.date::timestamp
    into after_value, after_ts
    from user_measures um
    where um.user_id = user_uuid
      and um.measure_id = v_measure_id
      and um.date > end_date
    order by um.date asc
    limit 1;

    -- INSIDE RANGE (weighted avg)
    with cleaned as (
      select 
        um.date::timestamp as ts, 
        um.value::numeric as val
      from user_measures um
      where um.user_id = user_uuid
        and um.measure_id = v_measure_id
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
    into v_sum, v_sec;

    -- FINAL VALUE RESOLUTION
    declare result numeric;
    begin
      if v_sec > 0 then
        result := v_sum / v_sec;

      elsif before_value is not null and after_value is not null then
        result :=
          before_value +
          (after_value - before_value) *
          extract(epoch from (range_start_ts - before_ts)) /
          extract(epoch from (after_ts - before_ts));

      elsif before_value is not null then
        result := before_value;

      elsif after_value is not null then
        result := after_value;

      else
        result := case v_measure_id
          when 1 then 70.0
          when 2 then 170.0
          when 5 then 1.4
        end;
      end if;

      if v_measure_id = 1 then peso := result;
      elsif v_measure_id = 2 then altura := result;
      elsif v_measure_id = 5 then actividad := result;
      end if;
    end;

  end loop;

  --------------------------------------------------------------------
  -- 2. SEXO Y NACIMIENTO DESDE public.user_info
  --------------------------------------------------------------------
  select birth_date, gender
  into nacimiento, sexo
  from public.user_info
  where user_id = user_uuid;

  if nacimiento is not null then
    edad := date_part('year', age(end_date, nacimiento));
  end if;

  if sexo is null then
    sexo := 'male';
  end if;

  --------------------------------------------------------------------
  -- 3. Cálculo final BMR
  --------------------------------------------------------------------
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