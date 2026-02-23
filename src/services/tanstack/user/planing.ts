import { useConfigDateRange, useConfigSelectedUserId } from "@src/store/slices/config/hook"
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { colsTableUserPlanning, userPlanning } from "@src/services/supabase/definitions";
import { saveDate } from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { queryClient } from "../queryClient";
import { useNotification } from "@src/store/slices/notification/hook";

export type FetchPlanningType = NonNullable<ReturnType<typeof useFetchPlanning>['data']>[number];

export const useFetchPlanning = ({
    startDate,
    endDate,
}: {
    startDate: Date,
    endDate: Date,
}) => {
    const dateRange = useConfigDateRange();
    const user = useConfigSelectedUserId();
    const languageCode = useLanguageCode();

    const effectiveStartDate = saveDate(startDate || dateRange.start);
    const effectiveEndDate = saveDate(endDate || dateRange.end);

    return useQuery({
        queryKey: queryKeys.user.planing(user, effectiveStartDate, effectiveEndDate),
        queryFn: async () => {
            if (!user) return null;
            const { data, error } = await supabase
                .from(userPlanning)
                .select(`*, type_id(
                    name: name->>${languageCode},
                    macros_id(*)
                )`)
                .eq(colsTableUserPlanning.userId, user)
                .gte(colsTableUserPlanning.date, effectiveStartDate)
                .lte(colsTableUserPlanning.date, effectiveEndDate)
                .order(colsTableUserPlanning.date);
            if (error) throw error;
            return data;
        }
    })
}

export type InsertMealType = {
    mealId: number;
    typeId: number;
    date: Date;
    delete?: boolean;
}

export const useInsertMeal = () => {
    const userId = useConfigSelectedUserId();
    const { addErrorIcon } = useNotification();

    const mutation = useMutation({
        mutationKey: queryKeys.user.planingBase(userId),
        mutationFn: async ({
            mealId,
            typeId,
            date,
            delete: isDelete = false,
        }: InsertMealType) => {
            if (!userId) throw new Error("User ID is required to insert a meal");

            if (isDelete) {
                const { error } = await supabase
                    .from(userPlanning)
                    .delete()
                    .eq(colsTableUserPlanning.userId, userId)
                    .eq(colsTableUserPlanning.mealId, mealId)
                    .eq(colsTableUserPlanning.date, saveDate(date));
                if (error) throw error;
                return null;
            }

            const { data, error } = await supabase
                .from(userPlanning)
                .upsert({
                    user_id: userId,
                    meal_id: mealId,
                    type_id: typeId,
                    date: saveDate(date),
                }).select();
            if (error) throw error;
            return data;
        },
        onSuccess: async () => {
            // Invalidate the planing query to refetch the updated data
            await queryClient.invalidateQueries({ queryKey: queryKeys.user.planingBase(userId) });
        },
        onError: (error) => {
            console.error("Error inserting meal:", error);
            addErrorIcon();
        }
    });

    return mutation;
}