import FromDate from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { useAppSelector } from "@src/store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import type { TablesInsert } from "@src/services/supabase/types";
import { useCallback } from "react";

const TABLE_NAME = "user_planing_meal" as const;

const selectFromMeal = (languageCode: ReturnType<typeof useLanguageCode>) => {
  return `*, recipe_type(*, name: name->>${languageCode})` as const;
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

export const useMutatePlaningMeals = ({
  forDate,
}: {
  forDate?: FromDate;
} = {}) => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const d = useAppSelector((state) => state.config.selectedDay);
  const language = useLanguageCode();
  const queryClient = useQueryClient();

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
        type_id: m.type_id!,
      }));

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .upsert(safeMeals)
        .select(selectFromMeal(language));
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      if (!data?.length) return;
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

  const safeDate = forDate ?? new FromDate(d);

  const mutation = useMutation({
    mutationFn: async (mealId: number | undefined) => {
      if (!userId) {
        throw new Error("User ID is required to delete a meal.");
      }

      if (mealId === undefined) {
        const { data, error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq("user_id", userId)
        .eq("date", safeDate.save())
        .select(selectFromMeal(language));
        if (error) throw new Error(error.message);
        return data;
      } 

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
    }
  });

  return mutation;
}
