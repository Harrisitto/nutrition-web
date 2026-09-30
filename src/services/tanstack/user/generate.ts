import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@src/services/supabase/client";
import { queryKeys } from "../keys";
import { useAppSelector } from "@src/store/store";
import { useLanguageCode } from "@src/hooks/helpers/language";
import type FromDate from "@src/helpers/dates";

/**
 * Genera (o completa) las comidas de un día con `change_kcal_on_planing` en
 * modo día entero: las comidas de `mealIds` que no existen se insertan y los
 * tipos se eligen por muestreo sobre el historial del usuario para acercarse
 * a `targetKcal`. Cada llamada usa una semilla nueva, así que repetirla da
 * otra combinación.
 */
export const useGeneratePlaningDay = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const language = useLanguageCode();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      date,
      mealIds,
      trainingKcal,
      targetKcal,
    }: {
      date: FromDate;
      mealIds: number[];
      trainingKcal: number;
      targetKcal: number;
    }) => {
      if (!userId) throw new Error("User ID is required to generate a day");

      const { data, error } = await supabase.rpc("generate_meal_types_for_day", {
        p_user_id: userId,
        p_date: date.save(),
        p_training_kcal: Math.round(trainingKcal),
        p_changable_meal_ids: mealIds,
        p_seed: Math.floor(Math.random() * 2147483647),
        p_target_kcal: Math.round(targetKcal),
      });
      if (error) throw error;
      return data ?? [];
    },
    // La RPC también puede crear la fila de `user_planing` y las recetas las
    // elige el trigger, así que se recargan ambas queries de la semana.
    onSuccess: (_data, { date }) => {
      const { monday, sunday } = date.thisWeek();
      queryClient.invalidateQueries({
        queryKey: queryKeys({ userId, language }).user.planing(
          monday.save(),
          sunday.save(),
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys({ userId, language }).user.meals(
          monday.save(),
          sunday.save(),
        ),
      });
    },
  });

  return mutation;
};
