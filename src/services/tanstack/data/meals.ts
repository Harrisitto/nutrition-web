import { useQuery } from "@tanstack/react-query"
import { colsTableAllMeals, tableAllMeals } from "@src/services/supabase/definitions";
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