import { useQuery } from "@tanstack/react-query";
import {
  TABLE_ALL_MEALS,
  TABLE_RECIPE_TYPES,
} from "@src/services/supabase/definitions";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { useMemo } from "react";
import { useFetchPlaningMealsForDate } from "../user/meals";

const fetchTypesForMeal = async (
  langCode: ReturnType<typeof useLanguageCode>,
) => {
  const { data, error } = await supabase
    .from(TABLE_RECIPE_TYPES.NAME)
    .select(
      `fat, hc, id, kcal, prot, name: name->>${langCode}, comment: comment->>${langCode}`,
    );
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
        .select(
          `
          id,
          order,
          name: name->>${langCode}
        `,
        )
        .order(TABLE_ALL_MEALS.COLS.ORDER);
      if (error) throw error;
      return data;
    },
  });
};

export const useFetchAllMealTypes = () => {
  const langCode = useLanguageCode();
  return useQuery({
    queryKey: queryKeys({
      language: langCode,
    }).data.allTypes,
    queryFn: async () => {
      return await fetchTypesForMeal(langCode);
    },
  });
};

export const useFetchOrderedMealsForId = ({
  mealId,
}: {
  mealId: number;
}) => {
  const mealsInfo = useFetchPlaningMealsForDate({
    prevRange: 28,
  });

  const { data: types } = useFetchAllMealTypes();

  const orderedMeals = useMemo(() => {
    if (!types || !mealsInfo?.data) return [];
    // 2. Acumulamos los conteos históricos
    const countMap = new Map<number, number>();
    for (const item of mealsInfo.data) {
      if (item.meal_id !== mealId) continue;
      const key = item.recipe_type.id;
      const currentCount = countMap.get(key);
      if (!currentCount) {
        countMap.set(key, 1);
        continue;
      }
      countMap.set(key, currentCount + 1);
    }

    return [...types].sort((a, b) => {
      const countA = countMap.get(a.id) ?? 0;
      const countB = countMap.get(b.id) ?? 0;
      const countDiff = countB - countA;
      if (countDiff !== 0) return countDiff;
      return Number(a.name) - Number(b.name);
    });
  }, [types, mealsInfo?.data, mealId]);

  // 3. Return a consistent shape matching standard TanStack Query hooks
  return {
    data: orderedMeals,
    isLoading: mealsInfo.isLoading || !types, // easily track joint loading state
    isError: mealsInfo.isError,
  };
};
