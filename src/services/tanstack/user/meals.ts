import FromDate from "@src/helpers/dates";
import { kcalByDate } from "@src/helpers/nutrition";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { useAppSelector } from "@src/store/store";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import type { ViewRow } from "@src/services/supabase/database";
import { useCallback } from "react";
import { useRefreshClientOrder } from "./profile";
import { invalidateMacros } from "./macros";
import { useNotification } from "@src/store/slices/notification/hook";
import { deleteMealIngredientsForSlots } from "../data/ingredients";

const TABLE_NAME = "user_planning_meals" as const;

/*
 * La receta de una comida es de public_recipes: del catálogo (catalog_recipes) o propia del
 * cliente o de su nutricionista (user_recipes). Se embeben las dos y `withRecipe` deja una sola,
 * `fixed_recipe`, con el nombre ya traducido.
 */
const selectFromMeal = (languageCode: ReturnType<typeof useLanguageCode>) => {
  return `*, recipe_type(*, name: name->>${languageCode}), catalog_recipe: catalog_recipes(name: name->>${languageCode}), own_recipe: user_recipes(name: name->>${languageCode})` as const;
};

const withRecipe = <
  T extends {
    catalog_recipe: { name: string | null } | null;
    own_recipe: { name: string | null } | null;
  },
>({ catalog_recipe, own_recipe, ...meal }: T) => ({
  ...meal,
  fixed_recipe: catalog_recipe ?? own_recipe,
});

type MealType = NonNullable<ReturnType<typeof useFetchPlaningMealsForDate>["data"]>[number];

/** Comida que se guarda: date y meal_id la identifican; las demás columnas que no vienen no cambian */
export type PlaningMealInput = Partial<
  Pick<ViewRow<"user_planning_meals">, "date" | "meal_id" | "type_id" | "recipe_id" | "is_fixed_recipe" | "recipe_comment">
>;

/**
 * Rango semanal de la query de comidas. La query y las mutaciones tienen que
 * calcularlo igual: si no, `setQueryData` escribe en una clave que nadie lee.
 */
const mealsWeekRange = (date: FromDate, prevRange = 0, postRange = 0) => ({
  monday: date.incrementDay(prevRange).thisMonday(),
  sunday: date.incrementDay(postRange).thisSunday(),
});

/** Una fila por (fecha, comida): el tipo es el valor, no parte de la identidad. */
const mealSlotId = (meal: MealType) => `${meal.date}-${meal.meal_id}`;

export const useFetchPlaningMealsForDate = ({ 
  date,
  prevRange,
  postRange,
}: { 
  date?: FromDate 
  prevRange?: number
  postRange?: number
} = {}) => {
  const d = useAppSelector((state) => state.config.selectedDay);
  const language = useLanguageCode();
  const userId = useAppSelector((state) => state.config.selectedUserId);

  const safeDate = date ?? new FromDate(d);
  // Por defecto 0: con el antiguo 1, un domingo seleccionado saltaba a la
  // semana siguiente (`thisMonday()` de un domingo ya devuelve su propio lunes).
  const { monday, sunday } = mealsWeekRange(
    safeDate,
    Math.floor(prevRange ?? 0),
    Math.floor(postRange ?? 0),
  );

  const query = useQuery({
    queryKey: queryKeys({
      userId,
      language,
    }).user.meals(monday.save(), sunday.save()),
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select(selectFromMeal(language))
        .eq("client_id", userId!)
        .gte("date", monday.save())
        .lte("date", sunday.save());

      if (error) throw new Error(error.message);

      return data.map(withRecipe);
    },
    enabled: !!userId,
  });

  const createMap = useCallback(() => {
    const map = new Map<string, NonNullable<typeof query.data>>();
    if (query.data?.length) {
      query.data.forEach((meal) => {
        const date = meal.date;
        if (!map.has(date)) {
          map.set(date, []);
        }
        map.get(date)?.push(meal);
      });
    }
    return map;
  }, [query.data]);

  return {
    ...query,
    createMap
  };
};

// Comidas entre dos fechas (ambas incluidas). La lista y sus kcal por día comparten caché
const mealsForDateRangeOptions = ({
  userId,
  language,
  start,
  end,
}: {
  userId: string | null;
  language: ReturnType<typeof useLanguageCode>;
  start: string;
  end: string;
}) =>
  queryOptions({
    queryKey: queryKeys({
      userId,
      language,
    }).user.meals(start, end),
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select(selectFromMeal(language))
        .eq("client_id", userId!)
        .gte("date", start)
        .lte("date", end);

      if (error) throw new Error(error.message);

      return data.map(withRecipe);
    },
    enabled: !!userId,
  });

// Comidas planificadas entre dos fechas cualesquiera (ambas incluidas)
export const useFetchPlaningMealsForDateRange = ({
  startDate,
  endDate,
}: {
  startDate: FromDate;
  endDate: FromDate;
}) => {
  const language = useLanguageCode();
  const userId = useAppSelector((state) => state.config.selectedUserId);

  return useQuery(
    mealsForDateRangeOptions({ userId, language, start: startDate.save(), end: endDate.save() }),
  );
};

// Kcal ingeridas en las comidas planificadas, por fecha ("YYYY-MM-DD")
export const useFetchMealsKcalForDateRange = ({
  startDate,
  endDate,
}: {
  startDate: FromDate;
  endDate: FromDate;
}) => {
  const language = useLanguageCode();
  const userId = useAppSelector((state) => state.config.selectedUserId);

  return useQuery({
    ...mealsForDateRangeOptions({ userId, language, start: startDate.save(), end: endDate.save() }),
    select: (meals) => kcalByDate(meals, (meal) => Number(meal.recipe_type?.kcal ?? 0)),
  });
};

export const useMutatePlaningMeals = ({
  forDate,
}: {
  forDate?: FromDate;
} = {}) => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const d = useAppSelector((state) => state.config.selectedDay);
  const language = useLanguageCode();
  const queryClient = useQueryClient();
  const refreshClientOrder = useRefreshClientOrder();
  const { addMutationError } = useNotification();

  const safeDate = forDate ?? new FromDate(d);

  const mutation = useMutation({
    mutationFn: async (meal: PlaningMealInput[]) => {
      if (!userId) {
        throw new Error("User ID is required for all meals.");
      }

      if (meal.some((m) => m.meal_id == null || m.type_id == null)) {
        throw new Error("Meal ID and type ID are required for all meals.");
      }

      const safeMeals = meal.map((m) => ({
        date: m.date ?? safeDate.save(),
        meal_id: m.meal_id!,
        type_id: m.type_id!,
        // Solo es fija si se eligió receta a mano
        is_fixed_recipe: m.is_fixed_recipe ?? false,
        recipe_id: m.recipe_id ?? null,
        recipe_comment: m.recipe_comment,
      }));

      // Receta guardada antes de guardar: si cambia, sus ingredientes adicionales sobran
      const { data: previous, error: previousError } = await supabase
        .from(TABLE_NAME)
        .select("date, meal_id, recipe_id, type_id, is_fixed_recipe")
        .eq("client_id", userId)
        .in("date", [...new Set(safeMeals.map((m) => m.date))])
        .in("meal_id", [...new Set(safeMeals.map((m) => m.meal_id))]);
      if (previousError) throw new Error(previousError.message);

      const findPrevious = (m: { date: string; meal_id: number }) =>
        previous.find((p) => p.date === m.date && p.meal_id === m.meal_id);

      // Sin receta fija, la receta la elige la base de datos: lo que identifica la elección
      // es el tipo, no la receta guardada
      const recipeChoice = (m: Pick<ViewRow<"user_planning_meals">, "is_fixed_recipe" | "recipe_id" | "type_id">) =>
        m.is_fixed_recipe ? `recipe:${m.recipe_id}` : `type:${m.type_id}`;
      const recipeChanged = safeMeals
        .filter((m) => {
          const old = findPrevious(m);
          return !!old && recipeChoice(old) !== recipeChoice(m);
        })
        .map((m) => ({ date: m.date, mealId: m.meal_id }));

      // user_planning_meals_upsert solo escribe las claves que vienen. recipe_id va si la receta
      // es fija, o null al soltarla (la base de datos elige otra); si no, la elegida se queda y
      // guardar solo el comentario no cambia la receta. recipe_comment solo si se envía: los
      // días predefinidos no lo traen y no deben borrarlo
      const payload = safeMeals.map(({ recipe_id, recipe_comment, ...m }) => ({
        ...m,
        ...(m.is_fixed_recipe
          ? { recipe_id }
          : findPrevious(m)?.is_fixed_recipe && { recipe_id: null }),
        ...(recipe_comment !== undefined && { recipe_comment }),
      }));

      const { error: upsertError } = await supabase.rpc("user_planning_meals_upsert", {
        p_client_id: userId,
        p_meals: payload,
      });
      if (upsertError) throw new Error(upsertError.message);

      // La RPC devuelve las filas sin los recursos embebidos: se leen de la vista
      const { data: saved, error } = await supabase
        .from(TABLE_NAME)
        .select(selectFromMeal(language))
        .eq("client_id", userId)
        .in("date", [...new Set(safeMeals.map((m) => m.date))])
        .in("meal_id", [...new Set(safeMeals.map((m) => m.meal_id))]);
      if (error) throw new Error(error.message);
      const data = saved
        .filter((m) => safeMeals.some((s) => s.date === m.date && s.meal_id === m.meal_id))
        .map(withRecipe);

      // Después del upsert: si este falla, los ingredientes no se pierden. Si falla el
      // borrado la comida ya está guardada: se avisa pero no se rechaza la mutación,
      // para que onSuccess actualice la caché con lo que hay en la base de datos
      try {
        await deleteMealIngredientsForSlots(userId, recipeChanged);
      } catch (e) {
        console.error(e);
        addMutationError();
      }
      return data;
    },
    // 23514: receta fijada que no llega a las macros del tipo; 42501/55000: sin permiso o sin suscripción
    onError: addMutationError,
    onSuccess: (data) => {
      invalidateMacros(userId);
      if (!data?.length) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys({ userId }).user.mealIngredientsBase,
      });
      const { monday, sunday } = mealsWeekRange(safeDate);
      queryClient.setQueryData(
        queryKeys({
          userId,
          language,
        }).user.meals(monday.save(), sunday.save()),
       (oldData: MealType[] | undefined) => {
          if (!oldData) return oldData;
          // El upsert reemplaza el `type_id` de la comida. Comparando por
          // (fecha, comida, tipo) el tipo nuevo parecía otra fila y se añadía
          // junto a la vieja, duplicando kcal en la tabla.
          const incoming = new Map(data.map((m) => [mealSlotId(m), m]));
          const known = new Set(oldData.map(mealSlotId));
          return [
            ...oldData.map((m) => incoming.get(mealSlotId(m)) ?? m),
            ...data.filter((m) => !known.has(mealSlotId(m))),
          ];
        },
      );
      refreshClientOrder();
    }
  });

  return mutation;
}

export const useDeletePlaningMeal = ({
  forDate,
}: {
  forDate?: FromDate;
} = {}) => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const d = useAppSelector((state) => state.config.selectedDay);
  const language = useLanguageCode();
  const queryClient = useQueryClient();
  const refreshClientOrder = useRefreshClientOrder();

  const safeDate = forDate ?? new FromDate(d);

  const mutation = useMutation({
    mutationFn: async (mealId: number | undefined) => {
      if (!userId) {
        throw new Error("User ID is required to delete a meal.");
      }

      // Borrar la comida borra sus ingredientes adicionales (ON DELETE CASCADE)
      let query = supabase
        .from(TABLE_NAME)
        .delete()
        .eq("client_id", userId)
        .eq("date", safeDate.save());
      if (mealId !== undefined) query = query.eq("meal_id", mealId);
      const { data, error } = await query.select("date, meal_id");
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      invalidateMacros(userId);
      queryClient.invalidateQueries({
        queryKey: queryKeys({ userId }).user.mealIngredientsBase,
      });
      if (!data) return;
      // La clave era (día, día) y la query guarda por (lunes, domingo): el
      // borrado nunca llegaba a tocar la caché que lee la tabla.
      const { monday, sunday } = mealsWeekRange(safeDate);
      queryClient.setQueryData(
        queryKeys({
          userId,
          language,
        }).user.meals(monday.save(), sunday.save()),
       (oldData: MealType[] | undefined) => {
          if (!oldData) return oldData;
          const deleted = new Set(data.map((m) => `${m.date}-${m.meal_id}`));
          return oldData.filter((m) => !deleted.has(mealSlotId(m)));
        },
      );
      refreshClientOrder();
    }
  });

  return mutation;
}

/** Refresca todo lo que cambia al copiar comidas: comidas, ingredientes, macros y orden de clientes */
const useInvalidateCopiedMeals = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const queryClient = useQueryClient();
  const refreshClientOrder = useRefreshClientOrder();

  return () => {
    invalidateMacros(userId);
    queryClient.invalidateQueries({ queryKey: queryKeys({ userId }).user.mealsBase });
    queryClient.invalidateQueries({
      queryKey: queryKeys({ userId }).user.mealIngredientsBase,
    });
    refreshClientOrder();
  };
};

/**
 * Clona las comidas de un día en otro (RPC user_planning_days_clone, una sola transacción): todas las
 * comidas (`user_planning_meals`) y sus ingredientes (`user_planning_meal_ingredients`). El destino
 * queda igual que el origen. No toca el día (`user_planning_days`: entreno, comentarios...)
 */
/**
 * Espera todas las RPC (en paralelo) y falla si alguna ha fallado. allSettled y no all: con all la
 * mutación acabaría en el primer error, con otras copias aún en marcha, y se invalidaría antes de tiempo
 */
const runAll = async (calls: PromiseLike<{ error: unknown }>[]) => {
  const results = await Promise.allSettled(calls);
  const errors = results.flatMap((result) =>
    result.status === "rejected"
      ? [result.reason]
      : result.value.error
        ? [result.value.error]
        : [],
  );
  if (errors.length) {
    throw new AggregateError(errors, `${errors.length}/${calls.length} copies failed`);
  }
};

/**
 * Clona las comidas de varios días (RPC user_planning_days_clone, una por par, en paralelo). Cada RPC es una
 * transacción: si una falla las demás se guardan igual. Se invalida una sola vez, al acabar todas
 * (onSettled: también si alguna ha fallado, porque las otras sí han cambiado datos)
 */
export const useCloneDayMeals = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const invalidate = useInvalidateCopiedMeals();

  return useMutation({
    mutationFn: async (clones: { from: FromDate; to: FromDate }[]) => {
      if (!userId) throw new Error("User ID is required to clone a day");
      await runAll(
        clones.map(({ from, to }) =>
          supabase.rpc("user_planning_days_clone", {
            p_client_id: userId,
            p_from: from.save(),
            p_to: to.save(),
          }),
        ),
      );
    },
    onSettled: invalidate,
  });
};

/**
 * Copia varias comidas (RPC user_planning_meals_copy, una por par, en paralelo). Igual que useCloneDayMeals:
 * cada copia es atómica por separado y se invalida una vez al acabar todas
 */
export const useCopyPlaningMeal = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const invalidate = useInvalidateCopiedMeals();

  return useMutation({
    mutationFn: async (
      copies: {
        from: { date: string; mealId: number };
        to: { date: string; mealId: number };
      }[],
    ) => {
      if (!userId) throw new Error("User ID is required to copy a meal");
      await runAll(
        copies.map(({ from, to }) =>
          supabase.rpc("user_planning_meals_copy", {
            p_client_id: userId,
            p_from_date: from.date,
            p_from_meal: from.mealId,
            p_to_date: to.date,
            p_to_meal: to.mealId,
          }),
        ),
      );
    },
    onSettled: invalidate,
  });
};
