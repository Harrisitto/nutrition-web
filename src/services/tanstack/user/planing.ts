import { useConfigDateRange, useConfigSelectedUserId } from "@src/store/slices/config/hook"
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { TABLE_RECEIPT_TYPES, TABLE_USER_PLANING, TABLE_USER_PLANING_MEAL } from "@src/services/supabase/definitions";
import { saveDate } from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { queryClient } from "../queryClient";
import { useNotification } from "@src/store/slices/notification/hook";

const selectFromMeal = (languageCode: ReturnType<typeof useLanguageCode>) => {
    return `*,
        ${TABLE_USER_PLANING_MEAL.COLS.TYPE_ID}(
        id,
        name: name->>${languageCode},
        ${TABLE_RECEIPT_TYPES.COLS.MACROS_ID}(*))` as const;
}

const selectFromPlaning = (languageCode: ReturnType<typeof useLanguageCode>) => {
    return `*, 
        ${TABLE_USER_PLANING_MEAL.NAME}(${selectFromMeal(languageCode)})` as const;
}

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
                .from(TABLE_USER_PLANING.NAME)
                .select(selectFromPlaning(languageCode))
                .eq(TABLE_USER_PLANING.COLS.USER_ID, user)
                .gte(TABLE_USER_PLANING.COLS.DATE, effectiveStartDate)
                .lte(TABLE_USER_PLANING.COLS.DATE, effectiveEndDate)
                .order(TABLE_USER_PLANING.COLS.DATE);
            if (error) throw error;
            return data;
        }
    })
}

export const useInsertPlaning = () => {
    const userId = useConfigSelectedUserId();
    const mutation = useMutation({
        mutationKey: queryKeys.user.planingBase(userId),
        mutationFn: async ({ date, trainingHc }: { date: Date; trainingHc?: number[] }) => {
            if (!userId) throw new Error("User ID is required to insert planing data");
            const { data, error } = await supabase
                .from(TABLE_USER_PLANING.NAME)
                .upsert({
                    user_id: userId,
                    date: saveDate(date),
                    training_hc: trainingHc || [],
                })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.user.planingBase(userId) });
        },
    })
    return mutation;
}

export const useInsertMeal = () => {
    const userId = useConfigSelectedUserId();
    const insertPlaning = useInsertPlaning();
    const { addErrorIcon } = useNotification();
    const languageCode = useLanguageCode();

    const mutation = useMutation({
        mutationKey: queryKeys.user.planingBase(userId),
        mutationFn: async ({
            planingId,
            mealId,
            typeId,
            date,
        }: {
            planingId?: number;
            mealId: number;
            typeId: number;
            date: Date;
        }) => {
            if (!userId) throw new Error("User ID is required to insert a meal");

            let id = planingId;

            if (!planingId) {
                const { data: selectData } = await supabase
                    .from(TABLE_USER_PLANING.NAME)
                    .select(TABLE_USER_PLANING.COLS.ID)
                    .eq(TABLE_USER_PLANING.COLS.USER_ID, userId)
                    .eq(TABLE_USER_PLANING.COLS.DATE, saveDate(date))
                    .single();

                if (selectData === null) {
                    // If no planing exists for the date, create one first
                    await insertPlaning.mutateAsync({ date, trainingHc: [] });
                }

                if (insertPlaning.isError) throw new Error("Failed to create planing for the date");
                id = selectData?.id ?? insertPlaning.data?.id; 
            }

            if (!id) throw new Error("Failed to retrieve or create planing ID");

            const { data, error } = await supabase
                .from(TABLE_USER_PLANING_MEAL.NAME)
                .upsert({
                    planing_id: id,
                    meal_id: mealId,
                    type_id: typeId,
                })
                .select(selectFromMeal(languageCode));
            if (error) throw error;
            return data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: queryKeys.user.planingBase(userId) });
        },
        onError: (error) => {
            console.error("Error inserting meal:", error);
            addErrorIcon();
        }
    });

    return mutation;
}

export const useDeleteMeal = () => {
    const userId = useConfigSelectedUserId();
    const { addErrorIcon } = useNotification();

    const mutation = useMutation({
        mutationKey: queryKeys.user.planingBase(userId),
        mutationFn: async ({
            planingId,
            mealId,
        }: {
            planingId: number;
            mealId: number;
        }) => {
            if (!userId) throw new Error("User ID is required to delete a meal");
            const { error } = await supabase
                .from(TABLE_USER_PLANING_MEAL.NAME)
                .delete()
                .eq(TABLE_USER_PLANING_MEAL.COLS.PLANING_ID, planingId)
                .eq(TABLE_USER_PLANING_MEAL.COLS.MEAL_ID, mealId);
            if (error) throw error;
            return null;
        },
        onSuccess: async () => {
            // Invalidate the planing query to refetch the updated data
            await queryClient.invalidateQueries({ queryKey: queryKeys.user.planingBase(userId) });
        },
        onError: (error) => {
            console.error("Error deleting meal:", error);
            addErrorIcon();
        }
    });

    return mutation;
}