import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import {
  TABLE_ALL_MEASURES,
  TABLE_USER_MEASURES,
} from "@src/services/supabase/definitions";
import { useLanguageCode } from "@src/hooks/helpers/language";
import type { Tables, TablesInsert } from "@src/services/supabase/types";
import { queryClient } from "../queryClient";
import { useGetAuthSession } from "../auth/get";
import { useAppSelector } from "@src/store/store";
import type FromDate from "@src/helpers/dates";

type UserMeasure = Tables<"user_measures">;
type UserMeasuresData = UserMeasure[];

const selectMeasuresFromAllMeasures = (
  languageCode: ReturnType<typeof useLanguageCode>,
) => {
  return `
        ${TABLE_ALL_MEASURES.COLS.ID},
        ${TABLE_ALL_MEASURES.COLS.NAME}: ${TABLE_ALL_MEASURES.COLS.NAME}->>${languageCode},
        ${TABLE_ALL_MEASURES.COLS.UNITS}: ${TABLE_ALL_MEASURES.COLS.UNITS}->>${languageCode},
        ${TABLE_ALL_MEASURES.COLS.DESCRIPTION}: ${TABLE_ALL_MEASURES.COLS.DESCRIPTION}->>${languageCode}
    ` as const;
};

const updateMeasuresQueries = (
  userId: string | null,
  updater: (oldData: UserMeasuresData) => UserMeasuresData,
) => {
  queryClient.setQueriesData<UserMeasuresData>(
    {
      queryKey: queryKeys({
        userId,
      }).user.measuresBase,
    },
    (oldData) => {
      if (!Array.isArray(oldData)) return oldData;
      return updater(oldData);
    },
  );
};

const upsertUserMeasureInQueries = (
  oldData: UserMeasuresData,
  updateData: UserMeasure,
) => {
  if (updateData.measure_id == null) return oldData;
  let found = false;
  const updated = oldData.map((measure) => {
    if (
      measure.measure_id === updateData.measure_id &&
      measure.date === updateData.date
    ) {
      found = true;
      return {
        ...measure,
        ...updateData,
      };
    }
    return measure;
  });

  if (!found) {
    return [...updated, updateData];
  }

  return updated;
};

const updateUserMeasure = (updateData: UserMeasure) => {
  updateMeasuresQueries(updateData.user_id, (oldData) => {
    return upsertUserMeasureInQueries(oldData, updateData);
  });
};

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
    },
  });
};

export const useFetchUserMeasuresForDateRange = ({
  startDate,
  endDate,
}: {
  startDate: FromDate;
  endDate: FromDate;
}) => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const start = startDate.save();
  const end = endDate.save();

  return useQuery({
    queryKey: queryKeys({
      userId,
    }).user.measuresForDateRange(startDate, endDate),
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from(TABLE_USER_MEASURES.NAME)
        .select("*")
        .eq(TABLE_USER_MEASURES.COLS.USER_ID, userId)
        .gte(TABLE_USER_MEASURES.COLS.DATE, start)
        .lte(TABLE_USER_MEASURES.COLS.DATE, end)
        .order(TABLE_USER_MEASURES.COLS.DATE);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useInsertUserMeasure = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  return useMutation({
    mutationKey: queryKeys({
      userId,
    }).user.measuresBase,
    mutationFn: async (
      insertData: Omit<TablesInsert<"user_measures">, "user_id">,
    ) => {
      if (!userId) throw new Error("No authenticated user found");
      const { data, error } = await supabase
        .from(TABLE_USER_MEASURES.NAME)
        .insert({
          ...insertData,
          user_id: userId,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      updateUserMeasure(data);
    },
  });
};

export const useDeleteMeasures = () => {
  const { data } = useGetAuthSession();
  const userId = data?.userId;
  return useMutation({
    mutationKey: queryKeys({
      userId,
    }).user.measuresBase,
    mutationFn: async ({
      measureId,
      date,
    }: {
      measureId: number;
      date: string;
    }) => {
      if (!userId) throw new Error("No authenticated user found");
      const { error } = await supabase
        .from(TABLE_USER_MEASURES.NAME)
        .delete()
        .eq(TABLE_USER_MEASURES.COLS.USER_ID, userId)
        .eq(TABLE_USER_MEASURES.COLS.MEASURE_ID, measureId)
        .eq(TABLE_USER_MEASURES.COLS.DATE, date);

      if (error) throw error;
    },
    onSuccess: (_, measureIds) => {
      if (!userId) return;
      updateMeasuresQueries(userId, (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter(
          (measure) =>
            measureIds.measureId !== measure.measure_id ||
            measure.date !== measureIds.date,
        );
      });
    },
  });
};
