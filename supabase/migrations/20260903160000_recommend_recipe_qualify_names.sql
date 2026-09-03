-- recommend_recipe() referenced all_recipes/user_recipe/nutri_recipe/
-- user_planing_meal without schema qualification. That's fine when the
-- trigger runs with a normal search_path, but clone_week_planing sets
-- search_path = '' for its own execution, and that empty search_path is
-- still in effect for triggers fired by inserts made inside it — so
-- cloning a week with meals failed with "relation all_recipes does not
-- exist". Qualify every relation and pin this function's own
-- search_path so it's correct regardless of the caller's context.
create or replace function public.recommend_recipe()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
    recommended_recipe_id integer;
    nutri_uuid uuid;
    combined_seed bigint;
begin
    nutri_uuid := auth.uid();

    combined_seed := (extract(epoch from date_trunc('day', NEW.date))::bigint)
                     # hashtext(NEW.user_id::text)
                     # hashtext(coalesce(NEW.meal_id, 0)::text);

    perform setseed(
        ((abs(combined_seed) % 2000000) / 2000000.0)
    );

    recommended_recipe_id := (
        select ar.id
        from public.all_recipes ar
        left join public.user_recipe ur
          on ar.id = ur.recipe_id
          and ur.user_id = NEW.user_id
        left join public.nutri_recipe nr
          on ar.id = nr.recipe_id
          and (nutri_uuid is not null and nr.nutri_id = nutri_uuid)
        where ar.type_id = NEW.type_id
          and ar.id not in (
              select upm.recipe_id
              from public.user_planing_meal upm
              where upm.user_id = NEW.user_id
                and upm.date = NEW.date
                and upm.recipe_id is not null
          )
        order by
            (
                coalesce(ur.rating, 40) +
                coalesce(nr.rating, 40) +
                coalesce(ur.times_used, 0) +
                coalesce(ur.times_interacted, 0)
            )
            + (random() * 100)
        desc
        limit 1
    );

    if recommended_recipe_id is null then
        recommended_recipe_id := (
            select ar.id
            from public.all_recipes ar
            left join public.user_recipe ur on ar.id = ur.recipe_id and ur.user_id = NEW.user_id
            left join public.nutri_recipe nr on ar.id = nr.recipe_id and (nutri_uuid is not null and nr.nutri_id = nutri_uuid)
            where ar.type_id = NEW.type_id
            order by (coalesce(ur.rating, 40) + coalesce(nr.rating, 40) + coalesce(ur.times_used, 0) + coalesce(ur.times_interacted, 0)) + (random() * 100) desc
            limit 1
        );
    end if;

    if recommended_recipe_id is not null then
        NEW.recipe_id := recommended_recipe_id;
    end if;

    return NEW;
end;
$$;
