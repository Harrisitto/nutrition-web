import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ModalShell from "./default/portal";
import type FromDate from "@src/helpers/dates";
import { useFetchMeals } from "@src/services/tanstack/data/meals";
import { useFetchPlanning } from "@src/services/tanstack/user/planing";
import { useFetchPlaningMealsForDate } from "@src/services/tanstack/user/meals";
import { useFetchBmr } from "@src/services/tanstack/user/info";
import { useGeneratePlaningDay } from "@src/services/tanstack/user/generate";

interface AutoGenerateEditorProps {
  date: FromDate;
  onClose: () => void;
}

const AutoGenerateEditor = ({ date, onClose }: AutoGenerateEditorProps) => {
  const { t } = useTranslation();
  const mealsQuery = useFetchMeals();
  const planingQuery = useFetchPlanning();
  const userMeals = useFetchPlaningMealsForDate();
  const bmr = useFetchBmr();
  const generate = useGeneratePlaningDay();
  const [message, setMessage] = useState<string | null>(null);
  // `null` hasta que el usuario toque algo: por defecto todas las comidas
  // visibles, sin tener que sincronizar el estado cuando carga la query.
  const [selected, setSelected] = useState<Set<number> | null>(null);

  const meals = useMemo(() => mealsQuery.data ?? [], [mealsQuery.data]);
  const selectedIds = useMemo(
    () => selected ?? new Set(meals.map((meal) => meal.id)),
    [selected, meals],
  );

  const day = useMemo(
    () => planingQuery.data?.find((el) => el.date === date.save()),
    [planingQuery.data, date],
  );

  const dayMeals = useMemo(
    () => (userMeals.data ?? []).filter((meal) => meal.date === date.save()),
    [userMeals.data, date],
  );

  const currentKcal = dayMeals.reduce(
    (acc, meal) => acc + (meal.recipe_type?.kcal ?? 0),
    0,
  );

  const targetKcal = useMemo(() => {
    if (typeof bmr.data !== "number") return null;
    const trainingCarbsKcal = (day?.training_hc ?? []).reduce(
      (acc, hc) => acc + (hc || 0) * 4,
      0,
    );
    // Mismo cálculo que la fila de balance energético, despejado para que el
    // balance del día quede en 0.
    return bmr.data + (day?.training_kcal ?? 0) - trainingCarbsKcal;
  }, [bmr.data, day]);

  const isReady = !!mealsQuery.data && targetKcal !== null;

  const toggleMeal = (mealId: number) => {
    const next = new Set(selectedIds);
    if (next.has(mealId)) next.delete(mealId);
    else next.add(mealId);
    setSelected(next);
  };

  const handleGenerate = async () => {
    if (targetKcal === null || selectedIds.size === 0) return;
    setMessage(null);

    // Tipos antes de generar, para saber si la RPC llegó a cambiar algo.
    const previousTypes = new Map(
      dayMeals.map((meal) => [meal.meal_id, meal.type_id]),
    );

    try {
      const result = await generate.mutateAsync({
        date,
        mealIds: Array.from(selectedIds),
        trainingKcal: day?.training_kcal ?? 0,
        targetKcal,
      });

      // Una comida seleccionada que sigue sin fila no tenía historial.
      const resultIds = new Set(result.map((meal) => meal.meal_id));
      const missing = meals
        .filter((meal) => selectedIds.has(meal.id) && !resultIds.has(meal.id))
        .map((meal) => String(meal.name));
      if (missing.length) {
        setMessage(
          t("data:dashboardTable.autoGenerate.noHistory", {
            meals: missing.join(", "),
          }),
        );
        return;
      }

      const hasChanges = result.some(
        (meal) => previousTypes.get(meal.meal_id) !== meal.type_id,
      );
      if (!hasChanges) {
        setMessage(t("data:dashboardTable.autoGenerate.noChanges"));
        return;
      }
      onClose();
    } catch (error) {
      console.error("Error generating day:", error);
      setMessage(t("data:dashboardTable.autoGenerate.error"));
    }
  };

  return (
    <ModalShell
      title={`${t("data:dashboardTable.autoGenerate.title")} (${date.save()})`}
      onClose={onClose}
    >
      <div className="space-y-3">
        <p className="text-sm text-text-body">
          {t("data:dashboardTable.autoGenerate.description")}
        </p>

        {!isReady ? (
          <p className="text-xs text-text-body">
            {t("data:dashboardTable.autoGenerate.loading")}
          </p>
        ) : (
          <>
            <div className="flex justify-between gap-2 rounded-lg bg-fade-green/10 px-3 py-2 text-xs font-semibold text-dark-green">
              <span>
                {t("data:dashboardTable.autoGenerate.target")}:{" "}
                {Math.round(targetKcal)} kcal
              </span>
              <span>
                {t("data:dashboardTable.autoGenerate.current")}:{" "}
                {Math.round(currentKcal)} kcal
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-dark-green">
                {t("data:dashboardTable.autoGenerate.selectMeals")}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelected(new Set(meals.map((m) => m.id)))}
                  className="rounded-md px-2 py-1 text-xs font-semibold text-dark-green hover:bg-nutrition-green/20"
                >
                  {t("data:dashboardTable.autoGenerate.selectAll")}
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="rounded-md px-2 py-1 text-xs font-semibold text-dark-green hover:bg-nutrition-green/20"
                >
                  {t("data:dashboardTable.autoGenerate.selectNone")}
                </button>
              </div>
            </div>

            <ul className="max-h-72 space-y-1 overflow-y-auto">
              {meals.map((meal) => {
                const current = dayMeals.find((m) => m.meal_id === meal.id);
                return (
                  <li key={meal.id}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-fade-green/10">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(meal.id)}
                        onChange={() => toggleMeal(meal.id)}
                        className="accent-dark-green"
                      />
                      <span className="flex-1 text-sm font-semibold text-dark-green">
                        {String(meal.name)}
                      </span>
                      <span className="text-xs text-text-body">
                        {current?.recipe_type
                          ? `${current.recipe_type.name} · ${current.recipe_type.kcal} kcal`
                          : "-"}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {!!message && (
          <p className="text-xs font-semibold text-dark-green">{message}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-nutrition-green/30 px-3 py-2 text-xs font-semibold text-dark-green"
          >
            {t("data:dashboardTable.autoGenerate.cancel")}
          </button>
          <button
            type="button"
            autoFocus
            disabled={!isReady || selectedIds.size === 0 || generate.isPending}
            onClick={handleGenerate}
            className="rounded-md bg-dark-green px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {generate.isPending
              ? t("data:dashboardTable.autoGenerate.generating")
              : t("data:dashboardTable.autoGenerate.confirm")}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default AutoGenerateEditor;
