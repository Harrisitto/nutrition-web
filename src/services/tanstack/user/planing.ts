import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import {
  TABLE_USER_PLANING,
} from "@src/services/supabase/definitions";
import FromDate from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { queryClient } from "../queryClient";
import { useNotification } from "@src/store/slices/notification/hook";
import { useAppSelector } from "@src/store/store";

type Planing = ReturnType<typeof useFetchPlanning>["data"];
type PlanningData = NonNullable<Planing>;
type PlanningDay = PlanningData[number];

const selectFromPlaning = () => {
  return `*` as const;
};

const updatePlanningWeekQuery = (
  userId: string | null,
  date: FromDate | string,
  updater: (oldData: PlanningData) => PlanningData,
) => {
  const { monday: start, sunday: end } = new FromDate(date).thisWeek();
  queryClient.setQueryData<PlanningData>(
    queryKeys({
      userId,
    }).user.planing(start.save(), end.save()),
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
  const index = oldData.findIndex((day) => day.date === dayData.date);
  if (index !== -1) {
    const updatedData = [...oldData];
    updatedData[index] = dayData;
    return updatedData;
  } else {
    return [...oldData, dayData];
  }
};

export const fetchPlanningWeek = async ({
  userId,
  dateRange,
}: {
  userId: string;
  dateRange: { start: string; end: string };
}) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from(TABLE_USER_PLANING.NAME)
    .select(selectFromPlaning())
    .eq(TABLE_USER_PLANING.COLS.USER_ID, userId)
    .gte(TABLE_USER_PLANING.COLS.DATE, dateRange.start)
    .lte(TABLE_USER_PLANING.COLS.DATE, dateRange.end)
    .order(TABLE_USER_PLANING.COLS.DATE);
  if (error) throw error;
  return data || [];
};

export const useFetchPlanning = ({
  forDate,
}: {
  forDate?: FromDate;
} = {}) => {
  const savedDate = useAppSelector((state) => state.config.selectedDay);
  const user = useAppSelector((state) => state.config.selectedUserId);
  const languageCode = useLanguageCode();

  // Garantiza que paramStartDate sea siempre una instancia de FromDate
  const paramStartDate = new FromDate(forDate || savedDate);

  // Usa los métodos que existen en tu clase FromDate
  const monday = paramStartDate.thisMonday();
  const sunday = paramStartDate.thisSunday();

  return useQuery({
    queryKey: queryKeys({
      userId: user,
      language: languageCode,
    }).user.planing(monday.save(), sunday.save()),
    queryFn: async () =>
      fetchPlanningWeek({
        userId: user || "",
        dateRange: { start: monday.save(), end: sunday.save() },
      }),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useInsertPlaning = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const languageCode = useLanguageCode();

  const mutation = useMutation({
    mutationKey: queryKeys({
      userId,
      language: languageCode,
    }).user.planingBase,
    mutationFn: async (upsertData: {
      date: FromDate;
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
          date: upsertData.date.save(),
        })
        .select(selectFromPlaning())
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      if (!data) return;
      updatePlanningWeekQuery(userId, data.date, (oldData: PlanningData) => {
        return upsertPlanningDayInWeek(oldData, data);
      });
    },
  });

  return mutation;
};

export const useDeletePlaning = ({ forDate }: { forDate?: FromDate } = {}) => {
  const d = useAppSelector((state) => state.config.selectedDay);
  const safeDate = forDate ?? new FromDate(d);
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const { addErrorIcon } = useNotification();

  const mutation = useMutation({
    mutationFn: async () => {
      console.log("Deleting planing for date:", safeDate);
      if (!userId) throw new Error("User ID is required to delete a planing");
      const targetDate = safeDate.save();

      const { error: existingPlaningError } =
        await supabase
          .from(TABLE_USER_PLANING.NAME)
          .delete()
          .eq(TABLE_USER_PLANING.COLS.DATE, targetDate)
          .eq(TABLE_USER_PLANING.COLS.USER_ID, userId)
          .select(TABLE_USER_PLANING.COLS.ID)
          .single();

      if (existingPlaningError) throw existingPlaningError;
      return { date: targetDate };
    },
    onSuccess: ({ date }) => {
      updatePlanningWeekQuery(userId, date, (oldData) => {
        return oldData.filter((day) => day.date !== date);
      });
    },
    onError: (error) => {
      console.error("Error deleting planing:", error);
      addErrorIcon();
    },
  });

  return mutation;
};