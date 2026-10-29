-- clone_week_planing no copiaba custom_url, así que al clonar una semana los
-- enlaces de cada día se perdían. Misma firma: solo se añade la columna.
create or replace function public.clone_week_planing(
  p_user_id uuid,
  p_from_monday date,
  p_to_monday date
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_user_id is null then
    raise exception 'User ID is required';
  end if;

  if p_from_monday = p_to_monday then
    return;
  end if;

  -- Clear whatever is currently on the target week before cloning into it.
  delete from public.user_planing
  where user_id = p_user_id
    and date >= p_to_monday
    and date < p_to_monday + 7;

  delete from public.user_planing_meal
  where user_id = p_user_id
    and date >= p_to_monday
    and date < p_to_monday + 7;

  -- Clone the day-level rows (comment, event, custom_url, training_hc,
  -- training_kcal), shifting each date by the same offset from the source
  -- week's Monday.
  insert into public.user_planing (user_id, date, comment, event, custom_url, training_hc, training_kcal)
  select
    user_id,
    p_to_monday + (date - p_from_monday),
    comment,
    event,
    custom_url,
    training_hc,
    training_kcal
  from public.user_planing
  where user_id = p_user_id
    and date >= p_from_monday
    and date < p_from_monday + 7;

  -- Clone the meals for that week the same way.
  insert into public.user_planing_meal (user_id, date, meal_id, recipe_id, type_id)
  select
    user_id,
    p_to_monday + (date - p_from_monday),
    meal_id,
    recipe_id,
    type_id
  from public.user_planing_meal
  where user_id = p_user_id
    and date >= p_from_monday
    and date < p_from_monday + 7;
end;
$$;

grant execute on function public.clone_week_planing(uuid, date, date) to authenticated;
