import { useQuery } from "@tanstack/react-query";
import { supabase } from "@src/services/supabase/client";
import { useAppSelector } from "@src/store/store";
import FromDate from "@src/helpers/dates";
import { queryKeys } from "../keys";
import { queryClient } from "../queryClient";

/**
 * Balance energético y macros de cada día entre dos fechas (ambas incluidas), calculados
 * en la base de datos a partir de comidas (+ ingredientes extra), entrenamiento, carreras,
 * BMR y peso. Por defecto, la semana del día seleccionado.
 */
export const useFetchMacrosForDateRange = ({
  startDate,
  endDate,
}: {
  startDate?: FromDate;
  endDate?: FromDate;
} = {}) => {
  const savedDate = useAppSelector((state) => state.config.selectedDay);
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const start = (startDate ?? new FromDate(savedDate).thisMonday()).save();
  const end = (endDate ?? new FromDate(savedDate).thisSunday()).save();

  return useQuery({
    queryKey: queryKeys({ userId }).user.macros(start, end),
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required to calculate macros");
      const { data, error } = await supabase.rpc(
        "calculate_macros_for_date_range",
        { p_user_id: userId, p_start_date: start, p_end_date: end },
      );
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId,
  });
};

/**
 * Hay que llamarlo tras cualquier mutación que cambie lo que suma la RPC: comidas,
 * ingredientes de comidas, kcal/HC de entrenamiento, carreras o mediciones (peso, BMR).
 * Sin userId invalida los de todos los clientes.
 */
export const invalidateMacros = (userId?: string | null) =>
  queryClient.invalidateQueries({
    queryKey: userId
      ? queryKeys({ userId }).user.macrosBase
      : queryKeys().user.macrosBase.slice(0, 2),
  });
