import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { TABLE_ALL_MEASURES, TABLE_USER_MEASURES } from "@src/services/supabase/definitions";
import { useConfigSelectedUserId } from "@src/store/slices/config/hook";
import { useLanguageCode } from "@src/hooks/helpers/language";

const selectMeasuresFromAllMeasures = (languageCode: ReturnType<typeof useLanguageCode>) => {
    return `
        ${TABLE_ALL_MEASURES.COLS.ID},
        ${TABLE_ALL_MEASURES.COLS.NAME}: ${TABLE_ALL_MEASURES.COLS.NAME}->>${languageCode},
        ${TABLE_ALL_MEASURES.COLS.UNITS}: ${TABLE_ALL_MEASURES.COLS.UNITS}->>${languageCode},
        ${TABLE_ALL_MEASURES.COLS.DESCRIPTION}: ${TABLE_ALL_MEASURES.COLS.DESCRIPTION}->>${languageCode}
    ` as const;
}

export const useFetchAllMeasures = () => {
    const languageCode = useLanguageCode();
    return useQuery({
        queryKey: queryKeys().data.measures,
        queryFn: async () => {
            const { data, error } = await supabase
                .from(TABLE_ALL_MEASURES.NAME)
                .select(selectMeasuresFromAllMeasures(languageCode));
            if (error) throw error;
            return data;
        }
    });     
};

export const useFetchUserMeasuresForDateRange = ({
    startDate,
    endDate,
}: {
    startDate: Date;
    endDate: Date;
}) => {
    const userId = useConfigSelectedUserId() || '';
    return useQuery({
        queryKey: queryKeys({
            userId,
        }).user.measuresForDateRange(startDate, endDate),
        queryFn: async () => {
            const { data, error } = await supabase
                .from(TABLE_USER_MEASURES.NAME)
                .select("*")
                .eq(TABLE_USER_MEASURES.COLS.USER_ID, userId)
                .gte(TABLE_USER_MEASURES.COLS.DATE, startDate.toISOString())
                .lte(TABLE_USER_MEASURES.COLS.DATE, endDate.toISOString());
            if (error) throw error;
            return data;
        }
    });
}