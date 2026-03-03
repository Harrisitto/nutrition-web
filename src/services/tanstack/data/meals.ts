import { useQuery } from "@tanstack/react-query"
import { TABLE_ALL_MEALS, TABLE_RECEIPT_MEALS } from "@src/services/supabase/definitions";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { useLanguageCode } from "@src/hooks/helpers/language";

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
        queryKey: queryKeys.data.receiptsForMeal(mealId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from(TABLE_RECEIPT_MEALS.NAME)
                .select(`type_id(
                    id,
                    name: name->>${langCode}
                )`)
                .eq(TABLE_RECEIPT_MEALS.COLS.MEAL_ID, mealId);
            if (error) throw error;
            return data;
        }
    })
}