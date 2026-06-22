import { useTranslation } from "react-i18next";
import {
  useFetchPlanning,
  useInsertPlaningWithMeals,
} from "../../../services/tanstack/user/planing";
import { useCallback, useState } from "react";
import { fromDate, saveDate } from "../../../helpers/dates";

export const CloneLastWeek = ({ startMonday }: { startMonday: Date }) => {
  const { t } = useTranslation();
  const upsertDay = useInsertPlaningWithMeals();
  const [selectedDate, setSelectedDate] = useState<string>(
    saveDate(fromDate().incrementDay(-7)),
  );
  const [isCloning, setIsCloning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchedWeek = useFetchPlanning({ forDate: new Date(selectedDate) });

  const cloneWeek = useCallback(async () => {
    if (!fetchedWeek.data) return;
    setError(null);
    setIsCloning(true);
    try {
      const monday = fromDate(startMonday);
      const newWeek = fetchedWeek.data.map((day, index) => ({
        ...day,
        date: monday.incrementDay(index),
      }));

      await Promise.all(
        newWeek.map((day) =>
          upsertDay.mutateAsync({
            ...day,
            meals: day.user_planing_meal.map((meal) => ({
                meal_id: meal.meal_id,
                type_id: meal.type_id.id,
            })),
          })
        )
      );
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setIsCloning(false);
    }
  }, [fetchedWeek.data, upsertDay, startMonday]);

  return (
    <div className="p-4 bg-white rounded-md shadow-sm w-full max-w-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">
          {t("data:dashboardTable.actions.cloneTitle")}
        </h3>
      </div>

      <label className="block text-xs text-gray-600 mb-2">
        {t("data:dashboardTable.actions.selectWeekLabel")}
      </label>
      <input
        type="date"
        className="w-full px-3 py-2 border rounded-md mb-3 text-sm"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <button
        className="px-3 py-2 bg-nutrition-green text-white rounded-md text-sm disabled:opacity-60"
        onClick={cloneWeek}
        disabled={isCloning || !fetchedWeek.data || fetchedWeek.isFetching}
      >
        {isCloning
          ? t("data:dashboardTable.actions.cloning")
          : t("data:dashboardTable.actions.cloneSelectedWeek")}
      </button>

      {error ? (
        <p className="mt-3 text-xs text-red-600">
          {t("data:dashboardTable.actions.cloneError")}
        </p>
      ) : null}

      {fetchedWeek.isFetching ? (
        <p className="mt-3 text-xs text-gray-500">
          {t("data:dashboardTable.actions.loadingWeek")}
        </p>
      ) : null}
    </div>
  );
};
