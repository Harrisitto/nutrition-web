import { useConfigDateRange, useConfigSelectedUserId } from "@src/store/slices/config/hook"
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { colsTableUserPlanning, userPlanning } from "@src/services/supabase/definitions";
import { saveDate } from "@src/helpers/dates";

export const useFetchPlanning = ({
    startDate,
    endDate,
}: {
        startDate: Date,
        endDate: Date,
}) => {
    const dateRange = useConfigDateRange();
    const user = useConfigSelectedUserId();

    const effectiveStartDate = saveDate(startDate || dateRange.start);
    const effectiveEndDate = saveDate(endDate || dateRange.end);

    return useQuery({
        queryKey: queryKeys.user.planing(user, effectiveStartDate, effectiveEndDate),
        queryFn: async () => {
            if (!user) return null;
            const { data, error } = await supabase
                .from(userPlanning)
                .select()
                .eq(colsTableUserPlanning.userId, user)
                .gte(colsTableUserPlanning.date, effectiveStartDate)
                .lte(colsTableUserPlanning.date, effectiveEndDate)
                .order(colsTableUserPlanning.date);
            if (error) throw error;
            return data;
        }
    })
}