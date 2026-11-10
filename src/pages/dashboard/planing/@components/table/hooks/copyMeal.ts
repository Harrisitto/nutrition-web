import { useCallback } from "react";
import FromDate from "@src/helpers/dates";
import {
  useCloneDayMeals,
  useCopyPlaningMeal,
} from "@src/services/tanstack/user/meals";
import { useNotification } from "@src/store/slices/notification/hook";

export type MealSlot = { date: string; mealId: number };

/**
 * Copia una comida a otra celda con `useCopyPlaningMeal` (RPC copy_planing_meal): la fila de
 * `user_planing_meal` y sus ingredientes, en una sola transacción. Lo que hubiera en el destino
 * se sustituye
 */
export const useCopyMeal = () => {
  const copyPlaningMeal = useCopyPlaningMeal();
  const { add: addNotification, addMutationError } = useNotification();

  const copyMeal = useCallback(
    async ({ from, to }: { from: MealSlot; to: MealSlot }) => {
      if (from.date === to.date && from.mealId === to.mealId) return;
      try {
        await copyPlaningMeal.mutateAsync({ from, to });
      } catch (error) {
        console.error("Error copying meal:", error);
        addMutationError();
        return;
      }
      addNotification({
        type: "success",
        message: "data:dashboardTable.actions.copyMealSuccess",
      });
    },
    [copyPlaningMeal, addNotification, addMutationError],
  );

  return { copyMeal, isPending: copyPlaningMeal.isPending };
};

/**
 * Clona las comidas (e ingredientes) de un día en otro con `useCloneDayMeals` (RPC
 * clone_day_planing): el destino queda igual que el origen
 */
export const useCloneDay = () => {
  const cloneDayMeals = useCloneDayMeals();
  const { add: addNotification, addMutationError } = useNotification();

  const cloneDay = useCallback(
    async ({ from, to }: { from: string; to: string }) => {
      if (from === to) return;
      try {
        await cloneDayMeals.mutateAsync({ from: new FromDate(from), to: new FromDate(to) });
      } catch (error) {
        console.error("Error cloning day:", error);
        addMutationError();
        return;
      }
      addNotification({
        type: "success",
        message: "data:dashboardTable.actions.cloneDaySuccess",
      });
    },
    [cloneDayMeals, addNotification, addMutationError],
  );

  return { cloneDay, isPending: cloneDayMeals.isPending };
};
