import type FromDate from "@src/helpers/dates";
import { useAppSelector } from "@src/store/store";
import { useFetchMeals } from "@src/services/tanstack/data/meals";
import { useFetchPlanning, useMutatePlaning } from "@src/services/tanstack/user/planing";
import { useFetchPlaningMealsForDate } from "@src/services/tanstack/user/meals";
import { useGeneratePlaningDay } from "@src/services/tanstack/user/generate";

// Guarda las kcal o los HC por hora de entreno de un dia. Con el ajuste automatico activado
// para ese cambio lo guarda la RPC de generar, que ademas reajusta las comidas del dia a la
// diferencia de entreno. Si la RPC falla (sin historial o sin combinacion, ya avisado con una
// notificacion) deshace tambien el entreno, asi que se guarda sin ajustar para no perderlo
export const useSaveTraining = () => {
  const autoAdjust = useAppSelector((state) => state.config.autoAdjustMeals);
  const planingMutation = useMutatePlaning();
  const generate = useGeneratePlaningDay();
  const planingQuery = useFetchPlanning();
  const userMeals = useFetchPlaningMealsForDate();
  const mealsQuery = useFetchMeals();

  const getDay = (date: FromDate) =>
    planingQuery.data?.find((day) => day.date === date.save());

  // Las comidas que ya tiene el dia; con el dia vacio, todas las visibles (como el modal)
  const getMealIds = (date: FromDate) => {
    const dayMealIds = (userMeals.data ?? [])
      .filter((meal) => meal.date === date.save())
      .map((meal) => meal.meal_id);
    return dayMealIds.length > 0 ? dayMealIds : (mealsQuery.data ?? []).map((meal) => meal.id);
  };

  const saveTrainingKcal = async (date: FromDate, kcal: number) => {
    const previous = getDay(date)?.training_kcal ?? 0;
    if (!autoAdjust.onTrainingKcalChange || kcal === previous) {
      return planingMutation.mutateAsync({ date, training_kcal: kcal });
    }
    try {
      await generate.mutateAsync({
        date,
        mealIds: getMealIds(date),
        trainingKcal: kcal,
        previousTrainingKcal: previous,
      });
    } catch {
      await planingMutation.mutateAsync({ date, training_kcal: kcal });
    }
  };

  const saveTrainingHc = async (date: FromDate, hc: number[]) => {
    const day = getDay(date);
    const previous = (day?.training_hc ?? []).map((value) => value ?? 0);
    const isUnchanged =
      hc.length === previous.length && hc.every((value, i) => value === previous[i]);
    if (!autoAdjust.onTrainingCarbsChange || isUnchanged) {
      return planingMutation.mutateAsync({ date, training_hc: hc });
    }
    try {
      await generate.mutateAsync({
        date,
        mealIds: getMealIds(date),
        // Obligatorio en la RPC: las kcal de entreno no cambian
        trainingKcal: day?.training_kcal ?? 0,
        trainingHc: hc,
        previousTrainingHc: previous,
      });
    } catch {
      await planingMutation.mutateAsync({ date, training_hc: hc });
    }
  };

  return { saveTrainingKcal, saveTrainingHc };
};
