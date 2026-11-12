import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { useLanguageCode } from "@src/hooks/helpers/language";
import type { ViewInsert, ViewRow } from "@src/services/supabase/database";
import { queryClient } from "../queryClient";
import { useAppSelector } from "@src/store/store";
import type FromDate from "@src/helpers/dates";
import { invalidateMacros } from "./macros";

// user_measurements también trae la definición de la medida (name, units...), que ya sale del catálogo
const USER_MEASURE_COLS = "client_id, measure_id, value, date" as const;

type UserMeasure = Pick<
  ViewRow<"user_measurements">,
  "client_id" | "measure_id" | "value" | "date"
>;
type UserMeasuresData = UserMeasure[];

const selectMeasuresFromAllMeasures = (
  languageCode: ReturnType<typeof useLanguageCode>,
) => {
  return `
        id,
        name: name->>${languageCode},
        units: units->>${languageCode},
        description: description->>${languageCode}
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
  updateMeasuresQueries(updateData.client_id, (oldData) => {
    return upsertUserMeasureInQueries(oldData, updateData);
  });
};

export const useFetchAllMeasures = () => {
  const languageCode = useLanguageCode();
  return useQuery({
    queryKey: queryKeys().data.measures,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalog_measurements")
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
        .from("user_measurements")
        .select(USER_MEASURE_COLS)
        .eq("client_id", userId)
        .gte("date", start)
        .lte("date", end)
        .order("date");

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

const SEARCH_LIMIT = 50;

// Registros del cliente de las mediciones cuyo nombre (en el idioma actual) contiene el texto
export const useSearchUserMeasures = ({ search }: { search: string }) => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const languageCode = useLanguageCode();
  const allMeasures = useFetchAllMeasures();
  const trimmed = search.trim().toLowerCase();
  // El nombre es JSON por idioma: se filtra el catálogo aquí y se consulta por ids
  const measureIds =
    allMeasures.data
      ?.filter((measure) => String(measure.name ?? "").toLowerCase().includes(trimmed))
      .map((measure) => measure.id) ?? [];

  return useQuery({
    queryKey: queryKeys({
      userId,
      language: languageCode,
    }).user.measuresSearch(trimmed),
    queryFn: async () => {
      if (!userId || measureIds.length === 0) return [];

      const { data, error } = await supabase
        .from("user_measurements")
        .select(USER_MEASURE_COLS)
        .eq("client_id", userId)
        .in("measure_id", measureIds)
        .order("date", { ascending: false })
        .limit(SEARCH_LIMIT);

      if (error) throw error;
      return data;
    },
    // Sin texto la búsqueda devolvería todas las mediciones
    enabled: !!userId && trimmed !== "" && allMeasures.isSuccess,
  });
};

export const useInsertUserMeasure = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  return useMutation({
    mutationKey: queryKeys({
      userId,
    }).user.measuresBase,
    mutationFn: async (
      insertData: Omit<ViewInsert<"user_measurements">, "client_id">,
    ) => {
      if (!userId) throw new Error("No authenticated user found");
      const { data, error } = await supabase
        .from("user_measurements")
        .insert({
          ...insertData,
          client_id: userId,
        })
        .select(USER_MEASURE_COLS)
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      updateUserMeasure(data);
      // El peso y el BMR salen de las mediciones
      invalidateMacros(userId);
    },
  });
};

export const useDeleteMeasures = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
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
        .from("user_measurements")
        .delete()
        .eq("client_id", userId)
        .eq("measure_id", measureId)
        .eq("date", date);

      if (error) throw error;
    },
    onSuccess: (_, measureIds) => {
      // El peso y el BMR salen de las mediciones
      invalidateMacros(userId);
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
