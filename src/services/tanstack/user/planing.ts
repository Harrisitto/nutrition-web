import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import {
  TABLE_USER_PLANING,
} from "@src/services/supabase/definitions";
import FromDate from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { useNotification } from "@src/store/slices/notification/hook";
import { useAppSelector } from "@src/store/store";

type Planing = ReturnType<typeof useFetchPlanning>["data"];
type PlanningData = NonNullable<Planing>;

const selectFromPlaning = () => {
  return `*` as const;
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

/**
 * Inserta o reemplaza el día dentro de la lista semanal cacheada.
 * `oldData.map()` por sí solo descarta los días que aún no existían en la
 * caché (los que se acaban de crear en la BBDD), y eso dejaba a
 * `TrainingHcRowInfo` leyendo siempre un array vacío.
 */
const upsertDayInWeek = (week: PlanningData, day: PlanningData[number]) => {
  const index = week.findIndex((el) => el.date === day.date);
  if (index === -1) {
    return [...week, day].sort((a, b) => a.date.localeCompare(b.date));
  }
  const next = [...week];
  next[index] = day;
  return next;
};

export const useMutatePlaning = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const languageCode = useLanguageCode();
  const queryClient = useQueryClient();

  const weekQueryKey = (date: FromDate) => {
    const { monday, sunday } = date.thisWeek();
    return queryKeys({
      userId,
      language: languageCode,
    }).user.planing(monday.save(), sunday.save());
  };

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
    // Actualiza la caché antes de que responda el servidor: así las filas se
    // reconstruyen de inmediato y una segunda edición ya parte del array
    // actualizado en lugar del que había al renderizar.
    onMutate: async (upsertData) => {
      const queryKey = weekQueryKey(upsertData.date);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<PlanningData>(queryKey);
      if (!previous) return { queryKey, previous };

      const date = upsertData.date.save();
      const current = previous.find((day) => day.date === date);
      const optimistic = {
        user_id: userId ?? "",
        comment: "",
        event: "",
        training_hc: [],
        training_kcal: 0,
        ...current,
        ...upsertData,
        date,
      } satisfies PlanningData[number];

      queryClient.setQueryData<PlanningData>(queryKey, (oldData) =>
        oldData ? upsertDayInWeek(oldData, optimistic) : oldData,
      );
      return { queryKey, previous };
    },
    onError: (_error, _variables, context) => {
      if (!context?.previous) return;
      queryClient.setQueryData<PlanningData>(context.queryKey, context.previous);
    },
    // `variables.date` ya es la fecha local que se editó; reconstruirla desde
    // `data.date` ("YYYY-MM-DD") la parsearía como UTC y en husos por detrás de
    // UTC caería en la semana anterior, escribiendo en la clave equivocada.
    onSuccess: (data, variables) => {
      if (!data) return;
      queryClient.setQueryData<PlanningData>(
        weekQueryKey(variables.date),
        (oldData) => (oldData ? upsertDayInWeek(oldData, data) : oldData),
      );
    },
  });

  return mutation;
};

export const useDeletePlaning = ({ forDate }: { forDate?: FromDate } = {}) => {
  const d = useAppSelector((state) => state.config.selectedDay);
  const safeDate = forDate ?? new FromDate(d);
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const { addErrorIcon } = useNotification();
  const queryClient = useQueryClient();
  const languageCode = useLanguageCode();
  
  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User ID is required to delete a planing");
      const targetDate = safeDate.save();

      // `user_planing` se identifica por (user_id, date): no tiene columna `id`,
      // así que pedirla hacía fallar el borrado entero. Tampoco se usa `.single()`
      // porque limpiar un día sin fila guardada debe ser un no-op, no un error.
      const { error: existingPlaningError } = await supabase
        .from(TABLE_USER_PLANING.NAME)
        .delete()
        .eq(TABLE_USER_PLANING.COLS.DATE, targetDate)
        .eq(TABLE_USER_PLANING.COLS.USER_ID, userId);

      if (existingPlaningError) throw existingPlaningError;
      return { date: targetDate };
    },
    onSuccess: ({ date }) => {
      const { monday, sunday } = safeDate.thisWeek();
      queryClient.setQueryData<PlanningData>(
        queryKeys({
          userId,
          language: languageCode,
        }).user.planing(monday.save(), sunday.save()),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter((day) => day.date !== date);
        },
      );
    },
    onError: (error) => {
      console.error("Error deleting planing:", error);
      addErrorIcon();
    },
  });

  return mutation;
};