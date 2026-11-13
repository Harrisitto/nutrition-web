import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { useCallback } from "react";
import { useAppSelector } from "@src/store/store";

const fetchTypesForMeal = async (
  langCode: ReturnType<typeof useLanguageCode>,
) => {
  const { data, error } = await supabase
    .from("recipe_type")
    .select(
      `fat, hc, id, kcal, prot, name: name->>${langCode}, comment: comment->>${langCode}`,
    );
  if (error) throw error;
  return data;
};

const fetchMeals = async (langCode: ReturnType<typeof useLanguageCode>) => {
  const { data, error } = await supabase
    .from("all_meals")
    .select(
      `
      id,
      order,
      name: name->>${langCode}
    `,
    )
    .order("order");
  if (error) throw error;
  return data;
};

/**
 * Meals ordered by the user's display config (falls back to the DB order).
 * By default hidden meals are filtered out; pass `onlyVisible: false` to get
 * all of them (e.g. in the settings form where they can be re-enabled).
 */
export const useFetchMeals = ({ onlyVisible = true } = {}) => {
  const langCode = useLanguageCode();
  const displayMeals = useAppSelector((state) => state.config.showMealsInTable);

  const applyDisplay = useCallback(
    (meals: Awaited<ReturnType<typeof fetchMeals>>) => {
      const displayMap = new Map(displayMeals);
      const getOrder = (meal: (typeof meals)[number]) =>
        displayMap.get(meal.id)?.order ?? meal.order ?? 0;

      return meals
        .filter(
          (meal) => !onlyVisible || (displayMap.get(meal.id)?.isVisible ?? true),
        )
        .sort((a, b) => getOrder(a) - getOrder(b));
    },
    [displayMeals, onlyVisible],
  );

  return useQuery({
    queryKey: queryKeys({
      language: langCode,
    }).data.meals,
    queryFn: () => fetchMeals(langCode),
    select: applyDisplay,
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
