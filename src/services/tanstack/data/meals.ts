import { useQueries, useQuery } from "@tanstack/react-query"
import { TABLE_ALL_MEALS, TABLE_RECIPE_TYPE_MEALS, TABLE_RECIPE_TYPES } from "@src/services/supabase/definitions";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { useLanguageCode } from "@src/hooks/helpers/language";

const fetchTypesForMeal = async (mealId: number, langCode: ReturnType<typeof useLanguageCode>) => {
  const { data, error } = await supabase
    .from(TABLE_RECIPE_TYPE_MEALS.NAME)
    .select(`meal_id, 
      type_id(
      id,
      name: name->>${langCode},
      macros_id(*)
      )`)
    .eq(TABLE_RECIPE_TYPE_MEALS.COLS.MEAL_ID, mealId);
  if (error) throw error;
  return data;
};

export const useFetchMeals = () => {
  const langCode = useLanguageCode();
  return useQuery({
    queryKey: queryKeys({
      language: langCode,
    }).data.meals,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE_ALL_MEALS.NAME)
        .select(`
          id,
          order,
          name: name->>${langCode}
        `)
        .order(TABLE_ALL_MEALS.COLS.ORDER);
      if (error) throw error;
      return data;
    }
  })
}

export const useFetchTypesForMeal = (mealId: number) => {
  const langCode = useLanguageCode();
  return useQuery({
    queryKey: queryKeys().data.typesForMeal(mealId),
    queryFn: () => fetchTypesForMeal(mealId, langCode)
  })
}

export const useFetchTypesForAllMeals = (mealListIds: number[]) => {
  const langCode = useLanguageCode();

  return useQueries({
    queries: mealListIds.map((mealId) => ({
      queryKey: queryKeys().data.typesForMeal(mealId),
      queryFn: () => fetchTypesForMeal(mealId, langCode),
    })),
    combine: (results) => {
      const byMealId = results.reduce((acc, result) => {
        if (result.isSuccess && result.data) {
          acc[result.data[0]?.meal_id ?? -1] = result.data;
        }
        return acc;
      }, {} as Record<number, Awaited<ReturnType<typeof fetchTypesForMeal>>>);
      return {
        byMealId,
        isPending: results.some((r) => r.isPending),
        isError: results.some((r) => r.isError),
      };
    },
  });
}

export const useFetchAllMealTypes = () => {
  const langCode = useLanguageCode();
  return useQuery({
    queryKey: queryKeys({
      language: langCode,
    }).data.allTypes,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE_RECIPE_TYPES.NAME)
        .select(`
          id,
          name: name->>${langCode},
          macros_id(*)
        `);
      if (error) throw error;
      return data;
    }
  })
}