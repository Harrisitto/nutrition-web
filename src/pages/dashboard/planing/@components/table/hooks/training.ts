import { useCallback } from "react";
import type FromDate from "@src/helpers/dates";
import { useAppSelector } from "@src/store/store";
import { useFetchMeals } from "@src/services/tanstack/data/meals";
import { useFetchPlanning, useMutatePlaning } from "@src/services/tanstack/user/planing";
import { useFetchPlaningMealsForDate } from "@src/services/tanstack/user/meals";
import { useGeneratePlaningDay } from "@src/services/tanstack/user/generate";

// Guarda las kcal o los HC por hora de entreno de un dia. Con el ajuste automatico activado
// para ese cambio, despues de guardar el entreno llama a la RPC de generar, que reajusta las
// comidas del dia a la diferencia de entreno. Si el guardado falla no se llama a la RPC; si
// falla la RPC (sin historial o sin combinacion, ya avisado con una notificacion) el entreno
// queda guardado sin ajustar las comidas
export const useSaveTraining = () => {
  const autoAdjust = useAppSelector((state) => state.config.autoAdjustMeals);
  // `mutateAsync` es estable entre renders; el objeto de la mutación no (cambia con su estado)
  const { mutateAsync: savePlaning } = useMutatePlaning();
  const { mutateAsync: generateDay } = useGeneratePlaningDay();
  const planing = useFetchPlanning().data;
  const userMeals = useFetchPlaningMealsForDate().data;
  const meals = useFetchMeals().data;

  // Estables mientras no cambien los datos: quien los use en dependencias no se re-ejecuta en cada render
  const getDay = useCallback(
    (date: FromDate) => planing?.find((day) => day.date === date.save()),
    [planing],
  );

  // Las comidas que ya tiene el dia; con el dia vacio, todas las visibles (como el modal)
  const getMealIds = useCallback(
    (date: FromDate) => {
      const dayMealIds = (userMeals ?? [])
        .filter((meal) => meal.date === date.save())
        .map((meal) => meal.meal_id);
      return dayMealIds.length > 0 ? dayMealIds : (meals ?? []).map((meal) => meal.id);
    },
    [userMeals, meals],
  );

  const saveTrainingKcal = useCallback(async (date: FromDate, kcal: number) => {
    const previous = getDay(date)?.training_kcal ?? 0;
    if (!autoAdjust.onTrainingKcalChange || kcal === previous) {
      return savePlaning({ date, training_kcal: kcal });
    }
    await savePlaning({ date, training_kcal: kcal });
    // El entreno nuevo ya esta guardado: sin `previous*` la diferencia seria 0
    await generateDay({
        date,
        mealIds: getMealIds(date),
        trainingKcal: kcal,
        previousTrainingKcal: previous,
      })
      .catch(() => {});
  }, [autoAdjust.onTrainingKcalChange, getDay, getMealIds, savePlaning, generateDay]);

  const saveTrainingHc = useCallback(async (date: FromDate, hc: number[]) => {
    const day = getDay(date);
    const previous = (day?.training_hc ?? []).map((value) => value ?? 0);
    const isUnchanged =
      hc.length === previous.length && hc.every((value, i) => value === previous[i]);
    if (!autoAdjust.onTrainingCarbsChange || isUnchanged) {
      return savePlaning({ date, training_hc: hc });
    }
    await savePlaning({ date, training_hc: hc });
    // Las kcal de entreno no cambian; se pasan como anteriores para no depender de lo guardado
    const trainingKcal = day?.training_kcal ?? 0;
    await generateDay({
        date,
        mealIds: getMealIds(date),
        trainingKcal,
        previousTrainingKcal: trainingKcal,
        trainingHc: hc,
        previousTrainingHc: previous,
      })
      .catch(() => {});
  }, [autoAdjust.onTrainingCarbsChange, getDay, getMealIds, savePlaning, generateDay]);

  return { saveTrainingKcal, saveTrainingHc };
};
