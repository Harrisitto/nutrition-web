import { useCallback } from "react";
import FromDate from "@src/helpers/dates";
import {
  useCloneDayMeals,
  useCopyPlaningMeal,
} from "@src/services/tanstack/user/meals";
import { useNotification } from "@src/store/slices/notification/hook";

export type MealSlot = { date: string; mealId: number };

/**
 * Copia una comida a una o varias celdas con `useCopyPlaningMeal` (RPC copy_planing_meal, en
 * paralelo): la fila de `user_planing_meal` y sus ingredientes, cada copia en su transacción. Lo que
 * hubiera en el destino se sustituye. Un solo aviso para todas
 */
export const useCopyMeal = () => {
  // `mutateAsync` es estable; el objeto de la mutación cambia con su estado
  const { mutateAsync: copyPlaningMeal, isPending } = useCopyPlaningMeal();
  const { add: addNotification, addMutationError } = useNotification();

  const copyMeal = useCallback(
    async ({ from, to }: { from: MealSlot; to: MealSlot[] }) => {
      const targets = to.filter(
        (slot) => slot.date !== from.date || slot.mealId !== from.mealId,
      );
      if (!targets.length) return;
      try {
        await copyPlaningMeal(targets.map((slot) => ({ from, to: slot })));
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

  return { copyMeal, isPending };
};

/**
 * Clona las comidas (e ingredientes) de un día en uno o varios días con `useCloneDayMeals` (RPC
 * clone_day_planing, en paralelo): cada destino queda igual que el origen. Un solo aviso para todos
 */
export const useCloneDay = () => {
  const { mutateAsync: cloneDayMeals, isPending } = useCloneDayMeals();
  const { add: addNotification, addMutationError } = useNotification();

  const cloneDay = useCallback(
    async ({ from, to }: { from: string; to: string[] }) => {
      const targets = to.filter((date) => date !== from);
      if (!targets.length) return;
      try {
        await cloneDayMeals(
          targets.map((date) => ({ from: new FromDate(from), to: new FromDate(date) })),
        );
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

  return { cloneDay, isPending };
};
