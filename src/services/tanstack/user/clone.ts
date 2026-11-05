import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@src/services/supabase/client";
import { queryKeys } from "../keys";
import { useAppSelector } from "@src/store/store";
import { useLanguageCode } from "@src/hooks/helpers/language";
import type FromDate from "@src/helpers/dates";
import { useRefreshClientOrder } from "./profile";
import { invalidateMacros } from "./macros";

export const useCloneWeek = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const language = useLanguageCode();
  const queryClient = useQueryClient();
  const refreshClientOrder = useRefreshClientOrder();

  const mutation = useMutation({
    mutationFn: async ({ from, to }: { from: FromDate; to: FromDate }) => {
      if (!userId) throw new Error("User ID is required to clone a week");

      const fromMonday = from.thisMonday();
      const toMonday = to.thisMonday();

      const { error } = await supabase.rpc("clone_week_planing", {
        p_user_id: userId,
        p_from_monday: fromMonday.save(),
        p_to_monday: toMonday.save(),
      });
      if (error) throw error;
      return { fromMonday, toMonday };
    },
    onSuccess: ({ toMonday }) => {
      invalidateMacros(userId);
      const toSunday = toMonday.thisSunday();
      // Las comidas reemplazadas pueden haber perdido sus ingredientes adicionales
      queryClient.invalidateQueries({
        queryKey: queryKeys({ userId }).user.mealIngredientsBase,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys({ userId, language }).user.planing(
          toMonday.save(),
          toSunday.save(),
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys({ userId, language }).user.meals(
          toMonday.save(),
          toSunday.save(),
        ),
      });
      refreshClientOrder();
    },
  });

  return mutation;
};
