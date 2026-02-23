import { useQuery } from "@tanstack/react-query"
import { colsTableAllMeals, colsTableReceiptMeals, tableAllMeals, tableReceiptMeals } from "@src/services/supabase/definitions";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { useLanguageCode } from "@src/hooks/helpers/language";

export const useFetchMeals = () => {
    const langCode = useLanguageCode();
    return useQuery({
        queryKey: queryKeys.data.meals(langCode),
        queryFn: async () => {
            const { data, error } = await supabase
                .from(tableAllMeals)
                .select(`
                    id,
                    order,
                    name: name->>${langCode}
                `)
                .order(colsTableAllMeals.order);
            if (error) throw error;
            return data;
        }
    })
}

export const useFetchReceiptsForMeal = (mealId: number) => {
    const langCode = useLanguageCode();
    return useQuery({
        queryKey: queryKeys.data.receiptsForMeal(mealId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from(tableReceiptMeals)
                .select(`*, type_id(
                    id,
                    name: name->>${langCode}
                )`)
                .eq(colsTableReceiptMeals.mealId, mealId);
            if (error) throw error;
            return data;
        }
    })
}