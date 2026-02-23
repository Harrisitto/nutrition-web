import { saveDate } from "@src/helpers/dates";
import { supabase } from "@src/services/supabase/client";
import { colsTableUserTraining, userTraining } from "@src/services/supabase/definitions";
import { useConfigDateRange, useConfigSelectedUserId } from "@src/store/slices/config/hook"
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { queryClient } from "../queryClient";

export const useFetchTraining = ({
    startDate,
    endDate,
}: {
    startDate: Date,
    endDate: Date,
}) => {
    const userId = useConfigSelectedUserId();
    const dateRange = useConfigDateRange();

    const effectiveStartDate = saveDate(startDate || dateRange.start);
    const effectiveEndDate = saveDate(endDate || dateRange.end);

    return useQuery({
        queryKey: queryKeys.user.training(userId, effectiveStartDate, effectiveEndDate),
        queryFn: async () => {
            if (!userId) throw new Error("User ID is required to fetch training data");
            const { data, error } = await supabase
                .from(userTraining)
                .select()
                .eq(colsTableUserTraining.userId, userId)
                .gte(colsTableUserTraining.date, effectiveStartDate)
                .lte(colsTableUserTraining.date, effectiveEndDate)
                .order(colsTableUserTraining.date);
            if (error) throw error;
            return data;
        }
    })
}

export const useInsertTraining = () => {
    const userId = useConfigSelectedUserId();

    const mutation = useMutation({
        mutationKey: queryKeys.user.trainingBase(userId),
        mutationFn: async ({ date, trainingHc }: { date: Date; trainingHc: number[] }) => {
            if (!userId) throw new Error("User ID is required to insert training data");
            const { error } = await supabase
                .from(userTraining)
                .upsert({
                    user_id: userId,
                    date: saveDate(date),
                    training_hc: trainingHc,
                });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.user.trainingBase(userId) });
        },
    })
    return mutation;
}