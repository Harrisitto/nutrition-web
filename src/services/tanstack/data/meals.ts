import { useQuery } from "@tanstack/react-query"
import { TABLE_ALL_MEALS, TABLE_RECIPE_TYPES } from "@src/services/supabase/definitions";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { useLanguageCode } from "@src/hooks/helpers/language";

const fetchTypesForMeal = async (langCode: ReturnType<typeof useLanguageCode>) => {
  const { data, error } = await supabase
    .from(TABLE_RECIPE_TYPES.NAME)
    .select(`fat, hc, id, kcal, prot, name: name->>${langCode}`)
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

export const useFetchAllMealTypes = () => {
  const langCode = useLanguageCode();
  return useQuery({
    queryKey: queryKeys({
      language: langCode,
    }).data.allTypes,
    queryFn: async () => {
      return await fetchTypesForMeal(langCode);
    }
  })
}