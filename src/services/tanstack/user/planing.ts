import { useConfigSelectedDay, useConfigSelectedUserId } from "@src/store/slices/config/hook"
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { TABLE_RECIPE_TYPES, TABLE_USER_PLANING, TABLE_USER_PLANING_MEAL } from "@src/services/supabase/definitions";
import { fromDate, saveDate } from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { queryClient } from "../queryClient";
import { useNotification } from "@src/store/slices/notification/hook";

const selectFromMeal = (languageCode: ReturnType<typeof useLanguageCode>) => {
    return `*,
        ${TABLE_USER_PLANING_MEAL.COLS.TYPE_ID}(
        id,
        name: name->>${languageCode},
        ${TABLE_RECIPE_TYPES.COLS.MACROS_ID}(*))` as const;
}

const selectFromPlaning = (languageCode: ReturnType<typeof useLanguageCode>) => {
    return `*, 
        ${TABLE_USER_PLANING_MEAL.NAME}(${selectFromMeal(languageCode)})` as const;
}

type Planing = ReturnType<typeof useFetchPlanning>['data']
type PlanningData = NonNullable<Planing>;
export type PlanningPageParam = { start: string; end: string };

const updatePlanningQueries = (
    userId: string | null,
    updater: (oldData: PlanningData) => PlanningData,
) => {
    queryClient.setQueriesData<PlanningData>(
        { queryKey: queryKeys.user.planingBase(userId) },
        (oldData) => {
            if (!oldData) return oldData;
            return updater(oldData);
        },
    );
};

const upsertPlanningDayInPages = (
    oldData: PlanningData,
    dayData: PlanningData["pages"][number][number],
) => {
    return {
        ...oldData,
        pages: oldData.pages.map((page, pageIndex) => {
            const existingIndex = page.findIndex((day) => day.id === dayData.id);
            if (existingIndex !== -1) {
                const updatedPage = [...page];
                updatedPage[existingIndex] = dayData;
                return updatedPage;
            }

            const pageParam = oldData.pageParams[pageIndex] as PlanningPageParam | undefined;
            const start = pageParam?.start;
            const end = pageParam?.end;
            const isInCurrentPageRange = !!start && !!end && dayData.date >= start && dayData.date <= end;

            if (!isInCurrentPageRange) return page;

            return [...page, dayData].sort((a, b) => a.date.localeCompare(b.date));
        }),
    };
};

export const useFetchPlanning = ({
    forDate,
}: {
    forDate?: Date,
} = {}) => {
    const savedDate = useConfigSelectedDay();
    const user = useConfigSelectedUserId();
    const languageCode = useLanguageCode();

    const paramStartDate = forDate || savedDate || new Date();
    const effectiveStartDate = saveDate(fromDate(paramStartDate).thisMonday());
    const effectiveEndDate = saveDate(fromDate(new Date(paramStartDate)).thisSunday());

    const initialPageParam = {
        start: effectiveStartDate,
        end: effectiveEndDate,
    };

    return useInfiniteQuery({
        queryKey: queryKeys.user.planing(user, effectiveStartDate, effectiveEndDate),
        initialPageParam,
        queryFn: async ({
            pageParam
        }) => {
            if (!user) return [];
            const { data, error } = await supabase
                .from(TABLE_USER_PLANING.NAME)
                .select(selectFromPlaning(languageCode))
                .eq(TABLE_USER_PLANING.COLS.USER_ID, user)
                .gte(TABLE_USER_PLANING.COLS.DATE, pageParam.start)
                .lte(TABLE_USER_PLANING.COLS.DATE, pageParam.end)
                .order(TABLE_USER_PLANING.COLS.DATE);
            if (error) throw error;
            return data || [];
        },
        getNextPageParam: (page) => {
            if (!page || page.length === 0) return undefined;
            const lastDate = page[page.length - 1].date;
            const opts = fromDate(new Date(lastDate));
            const nextStart = saveDate(opts.nextMonday());
            const nextEnd = saveDate(opts.nextSunday());
            if (nextStart > effectiveEndDate) return undefined;
            return { start: nextStart, end: nextEnd };
        },
        getPreviousPageParam: (page) => {
            if (!page || page.length === 0) return undefined;
            const firstDate = page[0].date;
            const opts = fromDate(new Date(firstDate));
            const prevStart = saveDate(opts.pastMonday());
            const prevEnd = saveDate(opts.pastSunday());
            if (prevEnd < effectiveStartDate) return undefined;
            return { start: prevStart, end: prevEnd };
        },
    })
}

export const useInsertPlaning = () => {
    const userId = useConfigSelectedUserId();
    const languageCode = useLanguageCode();
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
                .select(selectFromPlaning(languageCode))
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: async (data) => {
            if (!data) return;
            updatePlanningQueries(userId, (oldData) => {
                return upsertPlanningDayInPages(oldData, data);
            });
        }
    })
    return mutation;
}

export const useInsertMeal = () => {
    const userId = useConfigSelectedUserId();
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
            if (id == null) {
                const targetDate = saveDate(date);

                const { data: existingPlaning, error: existingPlaningError } = await supabase
                    .from(TABLE_USER_PLANING.NAME)
                    .select(TABLE_USER_PLANING.COLS.ID)
                    .eq(TABLE_USER_PLANING.COLS.USER_ID, userId)
                    .eq(TABLE_USER_PLANING.COLS.DATE, targetDate)
                    .maybeSingle();

                if (existingPlaningError) throw existingPlaningError;

                if (existingPlaning?.id != null) {
                    id = existingPlaning.id;
                } else {
                    const { data: createdPlaning, error: createdPlaningError } = await supabase
                        .from(TABLE_USER_PLANING.NAME)
                        .upsert({
                            user_id: userId,
                            date: targetDate,
                            training_hc: [],
                        })
                        .select(TABLE_USER_PLANING.COLS.ID)
                        .single();

                    if (createdPlaningError) throw createdPlaningError;
                    id = createdPlaning?.id;
                }
            }

            if (id == null) throw new Error("Failed to retrieve or create planing ID");

            const { data, error } = await supabase
                .from(TABLE_USER_PLANING_MEAL.NAME)
                .upsert({
                    planing_id: id,
                    meal_id: mealId,
                    type_id: typeId,
                })
                .select(selectFromMeal(languageCode))
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: async (data) => {
            if (!data) return;
            const planingId = data.planing_id;

            const { data: planingData, error: planingError } = await supabase
                .from(TABLE_USER_PLANING.NAME)
                .select(selectFromPlaning(languageCode))
                .eq(TABLE_USER_PLANING.COLS.ID, planingId)
                .single();

            if (planingError || !planingData) {
                if (planingError) throw planingError;
                return;
            }

            updatePlanningQueries(userId, (oldData) => {
                return upsertPlanningDayInPages(oldData, planingData);
            });
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
            return { planingId, mealId };
        },
        onSuccess: ({ planingId, mealId }) => {
            updatePlanningQueries(userId, (oldData) => {
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => {
                        const dayIndex = page.findIndex((day) => day.id === planingId);
                        if (dayIndex === -1) return page;
                        return page.map((day) => {
                            if (day.id !== planingId) return day;
                            const existingMeals = day.user_planing_meal || [];
                            const updatedMeals = existingMeals.filter((meal) => meal.meal_id !== mealId);
                            return {
                                ...day,
                                user_planing_meal: updatedMeals,
                            };
                        });
                    }),
                };
            });
        },
        onError: (error) => {
            console.error("Error deleting meal:", error);
            addErrorIcon();
        }
    });

    return mutation;
}