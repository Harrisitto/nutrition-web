import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@src/services/supabase/client";
import { queryKeys } from "../keys";
import { useAppSelector } from "@src/store/store";
import { useLanguageCode } from "@src/hooks/helpers/language";
import type FromDate from "@src/helpers/dates";
import { useRefreshClientOrder } from "./profile";
import { useNotification } from "@src/store/slices/notification/hook";

// La RPC trabaja con kcal enteras; undefined se queda sin enviar (null en la RPC)
const round = (kcal: number | undefined) =>
  kcal === undefined ? undefined : Math.round(kcal);

// Errores P0001 que lanza la RPC a proposito; su hint dice cual es
type GenerateError =
  | { kind: "noHistory" }
  | { kind: "noCombination"; target: string; closest?: string; margin?: string };

export const parseGenerateError = (error: unknown): GenerateError | null => {
  if (typeof error !== "object" || error === null) return null;
  const { code, message = "", hint = "" } = error as {
    code?: string;
    message?: string;
    hint?: string;
  };
  if (code !== "P0001") return null;
  // 'Las comidas cambiables no tienen historial en los últimos 7 días.'
  if (hint.includes("historial")) return { kind: "noHistory" };
  // 'No se encontró una combinación ... (objetivo: X kcal)' con hint
  // 'La más cercana se queda en Y kcal; el margen es de Z kcal.'
  const target = message.match(/objetivo: (-?\d+) kcal/)?.[1];
  if (!target) return null;
  const [, closest, margin] = hint.match(/(-?\d+) kcal; el margen es de (\d+) kcal/) ?? [];
  return { kind: "noCombination", target, closest, margin };
};

/**
 * Genera (o completa) las comidas de un día con `generate_meal_types_for_day`:
 * las comidas de `mealIds` que no existen se insertan y los tipos se eligen
 * sobre el historial del usuario para acercarse al objetivo. Cada llamada usa
 * una semilla nueva, así que repetirla da otra combinación.
 *
 * El objetivo lo calcula la RPC: parte de las kcal de las comidas actuales y
 * les suma el cambio de entreno (de `previous*` a `trainingKcal` y
 * `trainingHc`; sin `previous*`, desde lo guardado). Con el día vacío lo saca
 * del historial. El entreno nuevo lo guarda la propia RPC.
 *
 * Sin historial en la última semana o sin combinación dentro del margen, la
 * RPC falla y se avisa con una notificación.
 */
export const useGeneratePlaningDay = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const language = useLanguageCode();
  const queryClient = useQueryClient();
  const refreshClientOrder = useRefreshClientOrder();
  const { add: addNotification } = useNotification();

  const mutation = useMutation({
    mutationFn: async ({
      date,
      mealIds,
      trainingKcal,
      previousTrainingKcal,
      trainingHc,
      previousTrainingHc,
    }: {
      date: FromDate;
      mealIds: number[];
      // Kcal de entreno del día (las nuevas si cambian)
      trainingKcal: number;
      previousTrainingKcal?: number;
      // HC por hora de entreno, solo si cambian
      trainingHc?: number[];
      previousTrainingHc?: number[];
    }) => {
      if (!userId) throw new Error("User ID is required to generate a day");

      const { data, error } = await supabase.rpc("generate_meal_types_for_day", {
        p_user_id: userId,
        p_date: date.save(),
        p_changable_meal_ids: mealIds,
        p_seed: Math.floor(Math.random() * 2147483647),
        // Obligatorio: sin p_new_training_kcal, la RPC lo toma como el entreno nuevo
        p_training_kcal: Math.round(trainingKcal),
        p_old_training_kcal: round(previousTrainingKcal),
        p_new_training_hc: trainingHc,
        p_old_training_hc: previousTrainingHc,
      });
      if (error) throw error;
      return data ?? [];
    },
    onError: (error) => {
      const generateError = parseGenerateError(error);
      if (!generateError) return;
      addNotification(
        generateError.kind === "noHistory"
          ? { type: "error", duration: 6000, message: "data:dashboardTable.autoGenerate.noClientHistory" }
          : {
              type: "error",
              duration: 6000,
              message: generateError.closest
                ? "data:dashboardTable.autoGenerate.noCombinationClosest"
                : "data:dashboardTable.autoGenerate.noCombination",
              params: generateError,
            },
      );
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
      refreshClientOrder();
    },
  });

  return mutation;
};
