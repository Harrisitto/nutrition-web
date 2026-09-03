-- Clones one week of user_planing + user_planing_meal rows onto another week
-- for the currently authenticated user. A plpgsql FUNCTION body always runs
-- inside the caller's single implicit transaction, so if any statement below
-- fails, every delete/insert already done in this call is rolled back too —
-- no explicit BEGIN/COMMIT needed or possible here.
create or replace function public.clone_week_planing(
  p_from_monday date,
  p_to_monday date
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if p_from_monday = p_to_monday then
    return;
  end if;

  -- Clear whatever is currently on the target week before cloning into it.
  delete from public.user_planing
  where user_id = v_user_id
    and date >= p_to_monday
    and date < p_to_monday + 7;

  delete from public.user_planing_meal
  where user_id = v_user_id
    and date >= p_to_monday
    and date < p_to_monday + 7;

  -- Clone the day-level rows (comment, event, training_hc, training_kcal),
  -- shifting each date by the same offset from the source week's Monday.
  insert into public.user_planing (user_id, date, comment, event, training_hc, training_kcal)
  select
    user_id,
    p_to_monday + (date - p_from_monday),
    comment,
    event,
    training_hc,
    training_kcal
  from public.user_planing
  where user_id = v_user_id
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
  where user_id = v_user_id
    and date >= p_from_monday
    and date < p_from_monday + 7;
end;
$$;

grant execute on function public.clone_week_planing(date, date) to authenticated;
