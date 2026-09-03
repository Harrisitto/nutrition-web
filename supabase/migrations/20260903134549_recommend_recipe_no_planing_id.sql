/*
THIS FUNCTION WILL BE ADDED AS A TRIGGER.
IT WILL RECOMMEND A RECIPE FOR A USER, WHEN A MEAL IS ADDED TO THE PLANING
BASED ON USER RECIPES SCORE, INTERACTIONS AND NUTRITIONIST RECIPE INTERACTIONS
IT WILL ALSO ADD A LITTLE RANDOM VARIABILITY TO ALL RECIPES, SO THEY ARE A BIT DIFFERENT

Updated for the migration where user_planing_meal no longer references
user_planing via planing_id, and is instead keyed directly by
(user_id, date, meal_id).
*/
drop trigger if exists recommend_recipe_after_insert on user_planing_meal;
drop trigger if exists recommend_recipe_after_update on user_planing_meal;
drop trigger if exists recommend_recipe_before_insert on user_planing_meal;
drop function if exists recommend_recipe();
create or replace function recommend_recipe()
returns trigger
as $$
declare
    recommended_recipe_id integer;
    nutri_uuid uuid;
    combined_seed bigint;
begin
    -- 1. Capturamos auth.uid() sin cancelar si es NULL
    nutri_uuid := auth.uid();

    -- 2. Semilla para aleatoriedad reproducible, usando directamente
    --    la fecha y el usuario de la propia fila (ya no hay planing_id
    --    que resolver contra user_planing).
    combined_seed := (extract(epoch from date_trunc('day', NEW.date))::bigint)
                     # hashtext(NEW.user_id::text)
                     # hashtext(coalesce(NEW.meal_id, 0)::text);

    perform setseed(
        ((abs(combined_seed) % 2000000) / 2000000.0)
    );

    -- 3. Búsqueda de receta sin usar exención estricta si nutri_uuid es NULL
    recommended_recipe_id := (
        select ar.id
        from all_recipes ar
        left join user_recipe ur
          on ar.id = ur.recipe_id
          and ur.user_id = NEW.user_id
        left join nutri_recipe nr
          on ar.id = nr.recipe_id
          and (nutri_uuid is not null and nr.nutri_id = nutri_uuid) -- Maneja nutri_uuid nulo
        where ar.type_id = NEW.type_id
          and ar.id not in (
              select upm.recipe_id
              from user_planing_meal upm
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

    -- 4. Fallback si no hay recetas disponibles sin repetir
    if recommended_recipe_id is null then
        recommended_recipe_id := (
            select ar.id
            from all_recipes ar
            left join user_recipe ur on ar.id = ur.recipe_id and ur.user_id = NEW.user_id
            left join nutri_recipe nr on ar.id = nr.recipe_id and (nutri_uuid is not null and nr.nutri_id = nutri_uuid)
            where ar.type_id = NEW.type_id
            order by (coalesce(ur.rating, 40) + coalesce(nr.rating, 40) + coalesce(ur.times_used, 0) + coalesce(ur.times_interacted, 0)) + (random() * 100) desc
            limit 1
        );
    end if;

    -- 5. SIEMPRE retornar NEW
    -- Importante: En un BEFORE INSERT, si devuelves NULL cancelas la inserción silenciosamente.
    if recommended_recipe_id is not null then
        NEW.recipe_id := recommended_recipe_id;
    end if;

    return NEW;
end;
$$ language plpgsql;

create trigger recommend_recipe_before_insert
before insert on user_planing_meal
for each row
execute function recommend_recipe();

/*
create trigger recommend_recipe_after_update
after update of type_id on user_planing_meal
for each row
execute function recommend_recipe();
*/
