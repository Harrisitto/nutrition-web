import { supabase } from "@src/services/supabase/client";
import { queryKeys } from "../keys";
import { TABLE_USER_PRESET, TABLE_USER_PRESET_MEAL } from "@src/services/supabase/definitions";
import { useConfigSelectedUserId } from "@src/store/slices/config/hook";
import { useQuery } from "@tanstack/react-query";
import { useLanguageCode } from "@src/hooks/helpers/language";

const selectFromMeal = (languageCode: ReturnType<typeof useLanguageCode>) => {
    return `*,
        ${TABLE_USER_PRESET_MEAL.NAME}(
        preset_id,
        meal_id(
            id,
            name: name->>${languageCode}
        ),
        type_id(
            id,
            name: name->>${languageCode},
            all_macros(*)
        ))` as const;
}

export const useFetchPresets = () => {
    const userId = useConfigSelectedUserId();
    const languageCode = useLanguageCode();
    
    return useQuery({
        queryKey: queryKeys.user.presets(userId),
        queryFn: async () => {
            if (!userId) throw new Error("User ID is required to fetch presets");
            const { data, error } = await supabase
                .from(TABLE_USER_PRESET.NAME)
                .select(selectFromMeal(languageCode))
                .eq(TABLE_USER_PRESET.COLS.USER_ID, userId)
            
            if (error) throw error;
            return data;
        }
    })
}