import { useQueries, useQuery } from "@tanstack/react-query"
import { TABLE_ALL_MEALS, TABLE_RECIPE_TYPE_MEALS } from "@src/services/supabase/definitions";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { useMemo } from "react";

const fetchTypesForMeal = async (mealId: number, langCode: ReturnType<typeof useLanguageCode>) => {
    const { data, error } = await supabase
        .from(TABLE_RECIPE_TYPE_MEALS.NAME)
        .select(`meal_id, type_id(
            id,
            name: name->>${langCode}
        )`)
        .eq(TABLE_RECIPE_TYPE_MEALS.COLS.MEAL_ID, mealId);
    if (error) throw error;
    return data;
}

export const useFetchMeals = () => {
    const langCode = useLanguageCode();
    return useQuery({
        queryKey: queryKeys.data.meals(langCode),
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
        queryKey: queryKeys.data.typesForMeal(mealId),
        queryFn: () => fetchTypesForMeal(mealId, langCode)
    })
}

export const useFetchTypesForAllMeals = (mealListIds: number[]) => {
    const langCode = useLanguageCode();
    const mealIds = useMemo(() => mealListIds, [mealListIds]);
    return useQueries({
        queries: mealIds.map((mealId) => ({
            queryKey: queryKeys.data.typesForMeal(mealId),
            queryFn: () => fetchTypesForMeal(mealId, langCode)
        }))
    })
}