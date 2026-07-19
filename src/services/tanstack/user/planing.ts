import {
  useConfigSelectedDay,
  useConfigSelectedUserId,
} from "@src/store/slices/config/hook";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import {
  TABLE_USER_PLANING,
  TABLE_USER_PLANING_MEAL,
} from "@src/services/supabase/definitions";
import { fromDate, saveDate } from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { queryClient } from "../queryClient";
import { useNotification } from "@src/store/slices/notification/hook";

const selectFromMeal = (languageCode: ReturnType<typeof useLanguageCode>) => {
  return `*,
        ${TABLE_USER_PLANING_MEAL.COLS.TYPE_ID}(
        *,
  name: name->>${languageCode})` as const;
};

const selectFromPlaning = (
  languageCode: ReturnType<typeof useLanguageCode>,
) => {
  return `*,
        ${TABLE_USER_PLANING_MEAL.NAME}(${selectFromMeal(languageCode)})` as const;
};

type Planing = ReturnType<typeof useFetchPlanning>["data"];
type PlanningData = NonNullable<Planing>;
type PlanningDay = PlanningData[number];

const getPlaningWeekRange = (date: Date | string) => {
  const opts = fromDate(new Date(date));
  return {
    start: saveDate(opts.thisMonday()),
    end: saveDate(opts.thisSunday()),
  };
};

const updatePlanningWeekQuery = (
  userId: string | null,
  languageCode: ReturnType<typeof useLanguageCode>,
  date: Date | string,
  updater: (oldData: PlanningData) => PlanningData,
) => {
  const { start, end } = getPlaningWeekRange(date);
  queryClient.setQueryData<PlanningData>(
    queryKeys({
      userId,
      language: languageCode,
    }).user.planing(start, end),
    (oldData) => {
      if (!oldData) return oldData;
      return updater(oldData);
    },
  );
};

const updatePlanningQueries = (
  userId: string | null,
  languageCode: ReturnType<typeof useLanguageCode>,
  updater: (oldData: PlanningData) => PlanningData,
) => {
  queryClient.setQueriesData<PlanningData>(
    {
      queryKey: queryKeys({
        userId,
        language: languageCode,
      }).user.planingBase,
    },
    (oldData) => {
      if (!oldData) return oldData;
      return updater(oldData);
    },
  );
};

const upsertPlanningDayInWeek = (
  oldData: PlanningData,
  dayData: PlanningDay,
) => {
  const existingIndex = oldData.findIndex((day) => day.id === dayData.id);
  if (existingIndex !== -1) {
    const updated = [...oldData];
    updated[existingIndex] = dayData;
    return updated;
  }

  return [...oldData, dayData].sort((a, b) => a.date.localeCompare(b.date));
};

export const fetchPlanningWeek = async ({
  userId,
  languageCode,
  dateRange,
}: {
  userId: string;
  languageCode: ReturnType<typeof useLanguageCode>;
  dateRange: { start: string; end: string };
}) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from(TABLE_USER_PLANING.NAME)
    .select(selectFromPlaning(languageCode))
    .eq(TABLE_USER_PLANING.COLS.USER_ID, userId)
    .gte(TABLE_USER_PLANING.COLS.DATE, dateRange.start)
    .lte(TABLE_USER_PLANING.COLS.DATE, dateRange.end)
    .order(TABLE_USER_PLANING.COLS.DATE);
  if (error) throw error;
  return data || [];
};

export const useFetchPlanning = ({
  forDate,
  rangeInWeeks = 0,
}: {
  forDate?: Date;
  rangeInWeeks?: number;
} = {}) => {
  const savedDate = useConfigSelectedDay();
  const user = useConfigSelectedUserId();
  const languageCode = useLanguageCode();

  const paramStartDate = forDate || savedDate || new Date();
  const effectiveStartDate = saveDate(fromDate(paramStartDate).thisMonday());
  const effectiveEndDate = saveDate(
    fromDate(fromDate(paramStartDate).incrementDay(rangeInWeeks * 7)).thisSunday(),
  );

  console.log(effectiveEndDate, effectiveStartDate)

  return useQuery({
    queryKey: queryKeys({
      userId: user,
      language: languageCode,
    }).user.planing(effectiveStartDate, effectiveEndDate),
    queryFn: async () =>
      fetchPlanningWeek({
        userId: user || "",
        languageCode,
        dateRange: { start: effectiveStartDate, end: effectiveEndDate },
      }),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useInsertPlaning = () => {
  const userId = useConfigSelectedUserId();
  const languageCode = useLanguageCode();

  const mutation = useMutation({
    mutationKey: queryKeys({
      userId,
      language: languageCode,
    }).user.planingBase,
    mutationFn: async (upsertData: {
      date: Date;
      training_hc?: number[];
      training_kcal?: number;
      comment?: string;
      event?: string;
    }) => {
      if (!userId)
        throw new Error("User ID is required to insert planing data");
      const { data, error } = await supabase
        .from(TABLE_USER_PLANING.NAME)
        .upsert({
          user_id: userId,
          ...upsertData,
          date: saveDate(upsertData.date),
        })
        .select(selectFromPlaning(languageCode))
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      if (!data) return;
      updatePlanningWeekQuery(userId, languageCode, data.date, (oldData) => {
        return upsertPlanningDayInWeek(oldData, data);
      });
    },
  });

  return mutation;
};

export const useInsertPlaningWithMeals = () => {
  const userId = useConfigSelectedUserId();
  const languageCode = useLanguageCode();
  const { addErrorIcon } = useNotification();

  return useMutation({
    mutationKey: queryKeys({
      userId,
      language: languageCode,
    }).user.planingBase,
    mutationFn: async ({
      date,
      meals,
      training_hc,
      training_kcal,
      comment,
      event
    }: {
      date: Date;
      meals: {
        meal_id: number;
        type_id: number;
      }[];
      training_hc?: number[];
      training_kcal?: number;
      comment?: string;
      event?: string;
    }) => {
      if (!userId)
        throw new Error("User ID is required to insert planing data");

      const normalizedDate = saveDate(date);

      const { data: planingData, error: planingError } = await supabase
        .from(TABLE_USER_PLANING.NAME)
        .upsert({
          [TABLE_USER_PLANING.COLS.USER_ID]: userId,
          [TABLE_USER_PLANING.COLS.DATE]: normalizedDate,
          ...(training_hc != null
            ? { [TABLE_USER_PLANING.COLS.TRAINING_HC]: training_hc }
            : {}),
          ...(training_kcal != null ? { training_kcal } : {}),
          ...(comment != null ? { comment } : {}),
          ...(event != null ? { event } : {}),
        })
        .select(TABLE_USER_PLANING.COLS.ID)
        .single();

      if (planingError) throw planingError;

      const planingId = planingData?.id;
      if (planingId == null) throw new Error("Failed to retrieve planing ID");

      const uniqueMealsByMealId = new Map<
        number,
        { meal_id: number; type_id: number }
      >();
      for (const meal of meals) {
        uniqueMealsByMealId.set(meal.meal_id, meal);
      }

      const mealRows = Array.from(uniqueMealsByMealId.values()).map((meal) => ({
        [TABLE_USER_PLANING_MEAL.COLS.PLANING_ID]: planingId,
        [TABLE_USER_PLANING_MEAL.COLS.MEAL_ID]: meal.meal_id,
        [TABLE_USER_PLANING_MEAL.COLS.TYPE_ID]: meal.type_id,
      }));

      if (mealRows.length > 0) {
        const { error: mealError } = await supabase
          .from(TABLE_USER_PLANING_MEAL.NAME)
          .upsert(mealRows, {
            onConflict: `${TABLE_USER_PLANING_MEAL.COLS.PLANING_ID},${TABLE_USER_PLANING_MEAL.COLS.MEAL_ID}`,
          });

        if (mealError) throw mealError;
      }

      const { data: fullPlaningData, error: fullPlaningError } = await supabase
        .from(TABLE_USER_PLANING.NAME)
        .select(selectFromPlaning(languageCode))
        .eq(TABLE_USER_PLANING.COLS.ID, planingId)
        .single();

      if (fullPlaningError) throw fullPlaningError;
      return fullPlaningData;
    },
    onSuccess: (data) => {
      if (!data) return;
      updatePlanningWeekQuery(userId, languageCode, data.date, (oldData) => {
        return upsertPlanningDayInWeek(oldData, data);
      });
    },
    onError: (error) => {
      console.error("Error inserting planing with meals:", error);
      addErrorIcon();
    },
  });
};

export const useInsertMeal = () => {
  const userId = useConfigSelectedUserId();
  const { addErrorIcon } = useNotification();
  const languageCode = useLanguageCode();

  const mutation = useMutation({
    mutationKey: queryKeys({
      userId,
      language: languageCode,
    }).user.planingBase,
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

        const { data: existingPlaning, error: existingPlaningError } =
          await supabase
            .from(TABLE_USER_PLANING.NAME)
            .select(TABLE_USER_PLANING.COLS.ID)
            .eq(TABLE_USER_PLANING.COLS.USER_ID, userId)
            .eq(TABLE_USER_PLANING.COLS.DATE, targetDate)
            .maybeSingle();

        if (existingPlaningError) throw existingPlaningError;

        if (existingPlaning?.id != null) {
          id = existingPlaning.id;
        } else {
          const { data: createdPlaning, error: createdPlaningError } =
            await supabase
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

      if (id == null)
        throw new Error("Failed to retrieve or create planing ID");

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

      updatePlanningWeekQuery(
        userId,
        languageCode,
        planingData.date,
        (oldData) => {
          return upsertPlanningDayInWeek(oldData, planingData);
        },
      );
    },
    onError: (error) => {
      console.error("Error inserting meal:", error);
      addErrorIcon();
    },
  });

  return mutation;
};

export const useDeleteMeal = () => {
  const userId = useConfigSelectedUserId();
  const languageCode = useLanguageCode();
  const { addErrorIcon } = useNotification();

  const mutation = useMutation({
    mutationKey: queryKeys({
      userId,
      language: languageCode,
    }).user.planingBase,
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
      updatePlanningQueries(userId, languageCode, (oldData) => {
        return oldData.map((day) => {
          if (day.id !== planingId) return day;
          const existingMeals = day.user_planing_meal || [];
          const updatedMeals = existingMeals.filter(
            (meal) => meal.meal_id !== mealId,
          );
          return {
            ...day,
            user_planing_meal: updatedMeals,
          };
        });
      });
    },
    onError: (error) => {
      console.error("Error deleting meal:", error);
      addErrorIcon();
    },
  });

  return mutation;
};

export const useDeletePlaning = () => {
  const userId = useConfigSelectedUserId();
  const languageCode = useLanguageCode();
  const { addErrorIcon } = useNotification();

  const mutation = useMutation({
    mutationKey: queryKeys({
      userId,
      language: languageCode,
    }).user.planingBase,
    mutationFn: async (date: Date) => {
      console.log("Deleting planing for date:", date);
      if (!userId) throw new Error("User ID is required to delete a planing");
      const targetDate = saveDate(date);

      const { data: existingPlaning, error: existingPlaningError } =
        await supabase
          .from(TABLE_USER_PLANING.NAME)
          .delete()
          .eq(TABLE_USER_PLANING.COLS.DATE, targetDate)
          .eq(TABLE_USER_PLANING.COLS.USER_ID, userId)
          .select(TABLE_USER_PLANING.COLS.ID)
          .single();

      if (existingPlaningError) throw existingPlaningError;
      return { planingId: existingPlaning.id, date: targetDate };
    },
    onSuccess: ({ planingId, date }) => {
      updatePlanningWeekQuery(userId, languageCode, date, (oldData) => {
        return oldData.filter((day) => day.id !== planingId);
      });
    },
    onError: (error) => {
      console.error("Error deleting planing:", error);
      addErrorIcon();
    },
  });

  return mutation;
};
