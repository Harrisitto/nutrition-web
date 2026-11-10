import FromDate from "@src/helpers/dates";
import { kcalByDate } from "@src/helpers/nutrition";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { useAppSelector } from "@src/store/store";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import type { TablesInsert } from "@src/services/supabase/types";
import { useCallback } from "react";
import { useRefreshClientOrder } from "./profile";
import { invalidateMacros } from "./macros";
import { useNotification } from "@src/store/slices/notification/hook";
import {
  deleteMealIngredientsForDate,
  deleteMealIngredientsForSlots,
} from "../data/ingredients";

const TABLE_NAME = "user_planing_meal" as const;

const selectFromMeal = (languageCode: ReturnType<typeof useLanguageCode>) => {
  return `*, recipe_type(*, name: name->>${languageCode}), fixed_recipe: all_recipes(name: name->>${languageCode})` as const;
};

type MealType = NonNullable<ReturnType<typeof useFetchPlaningMealsForDate>["data"]>[number];

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
        .eq("user_id", userId!)
        .gte("date", monday.save())
        .lte("date", sunday.save());

      if (error) throw new Error(error.message);

      return data;
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
        .eq("user_id", userId!)
        .gte("date", start)
        .lte("date", end);

      if (error) throw new Error(error.message);

      return data;
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
    mutationFn: async (meal: Partial<TablesInsert<'user_planing_meal'>>[]) => {
      if (!userId) {
        throw new Error("User ID is required for all meals.");
      }

      if (meal.some((m) => m.meal_id == null || m.type_id == null)) {
        throw new Error("Meal ID and type ID are required for all meals.");
      }

      const safeMeals: TablesInsert<'user_planing_meal'>[] = meal.map((m) => ({
        user_id: userId,
        date: m.date ?? safeDate.save(),
        meal_id: m.meal_id!,
        recipe_id: m.recipe_id ?? null,
        // Solo es fija si se eligio receta a mano. Puede serlo sin recipe_id: las recetas
        // propias (custom_recipes) no están en all_recipes y van como ingredientes
        is_fixed_recipe: m.is_fixed_recipe ?? false,
        type_id: m.type_id!,
        // Solo si se envía: los presets no lo traen y el upsert no debe borrarlo
        ...(m.recipe_comment !== undefined && { recipe_comment: m.recipe_comment }),
      }));

      // Receta guardada antes del upsert: si cambia, sus ingredientes adicionales sobran
      const { data: previous, error: previousError } = await supabase
        .from(TABLE_NAME)
        .select("date, meal_id, recipe_id, type_id, is_fixed_recipe")
        .eq("user_id", userId)
        .in("date", [...new Set(safeMeals.map((m) => m.date))])
        .in("meal_id", [...new Set(safeMeals.map((m) => m.meal_id))]);
      if (previousError) throw new Error(previousError.message);

      // Sin receta fija, recipe_id lo rellena el trigger recommend_recipe y la petición
      // lleva null: lo que identifica la elección es el tipo, no la receta guardada
      const recipeChoice = (m: Pick<TablesInsert<'user_planing_meal'>, "is_fixed_recipe" | "recipe_id" | "type_id">) =>
        m.is_fixed_recipe ? `recipe:${m.recipe_id}` : `type:${m.type_id}`;
      const recipeChanged = safeMeals
        .filter((m) => {
          const old = previous.find((p) => p.date === m.date && p.meal_id === m.meal_id);
          return !!old && recipeChoice(old) !== recipeChoice(m);
        })
        .map((m) => ({ date: m.date, mealId: m.meal_id }));

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .upsert(safeMeals)
        .select(selectFromMeal(language));
      if (error) throw new Error(error.message);

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

      // Primero los ingredientes adicionales: cuelgan de la comida por FK
      if (mealId === undefined) {
        await deleteMealIngredientsForDate(userId, safeDate.save());
        const { data, error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq("user_id", userId)
        .eq("date", safeDate.save())
        .select(selectFromMeal(language));
        if (error) throw new Error(error.message);
        return data;
      } 

      await deleteMealIngredientsForSlots(userId, [{ date: safeDate.save(), mealId }]);
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq("user_id", userId)
        .eq("date", safeDate.save())
        .eq("meal_id", mealId)
        .select(selectFromMeal(language));
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
          const deleted = new Set(data.map(mealSlotId));
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
 * Clona las comidas de un día en otro (RPC clone_day_planing, una sola transacción): todas las
 * filas de `user_planing_meal` y sus ingredientes (`user_planing_meal_ingredients`). El destino
 * queda igual que el origen. No toca `user_planing` (entreno, comentarios del día...)
 */
export const useCloneDayMeals = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const invalidate = useInvalidateCopiedMeals();

  return useMutation({
    mutationFn: async ({ from, to }: { from: FromDate; to: FromDate }) => {
      if (!userId) throw new Error("User ID is required to clone a day");
      const { error } = await supabase.rpc("clone_day_planing", {
        p_user_id: userId,
        p_from: from.save(),
        p_to: to.save(),
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
};

/**
 * Copia una comida en otra celda (RPC copy_planing_meal, una sola transacción): tipo, receta, si
 * es fija, comentario e ingredientes. Lo que tuviera el destino se sustituye.
 * Error P0002 si la comida de origen no existe
 */
export const useCopyPlaningMeal = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const invalidate = useInvalidateCopiedMeals();

  return useMutation({
    mutationFn: async ({
      from,
      to,
    }: {
      from: { date: string; mealId: number };
      to: { date: string; mealId: number };
    }) => {
      if (!userId) throw new Error("User ID is required to copy a meal");
      const { error } = await supabase.rpc("copy_planing_meal", {
        p_user_id: userId,
        p_from_date: from.date,
        p_from_meal: from.mealId,
        p_to_date: to.date,
        p_to_meal: to.mealId,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
};
