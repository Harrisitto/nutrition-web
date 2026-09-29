import { useEffect, useRef, useState } from "react";
import { useFetchMeals } from "../../../../services/tanstack/data/meals";
import { setMealDisplay } from "../../../../store/slices/config/store";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";

// Keeps the typed value locally and only commits on blur/Enter, so the list
// doesn't re-sort (and move the row) on every keystroke
const OrderInput = ({
  value,
  label,
  onCommit,
}: {
  value: number;
  label: string;
  onCommit: (value: number) => void;
}) => {
  const [draft, setDraft] = useState(String(value));
  const cancelled = useRef(false);

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    if (cancelled.current) {
      cancelled.current = false;
      setDraft(String(value));
      return;
    }
    const parsed = Number(draft);
    if (draft.trim() === "" || !Number.isFinite(parsed)) {
      setDraft(String(value));
      return;
    }
    if (parsed !== value) onCommit(parsed);
  };

  return (
    <input
      type="number"
      value={draft}
      aria-label={label}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          cancelled.current = true;
          e.currentTarget.blur();
        }
      }}
      className="w-12 border-b-2 border-transparent bg-transparent py-1 text-center text-sm font-bold tabular-nums text-nutrition-green outline-none transition-colors [appearance:textfield] hover:border-nutrition-green/25 focus:border-nutrition-green [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  );
};

const DisplayMealsForm = () => {
  const { t } = useTranslation("forms");
  const dispatch = useAppDispatch();

  const showMealsInTable = useAppSelector(
    (state) => state.config.showMealsInTable,
  );
  // Hidden meals included so they can be re-enabled; already sorted by the hook
  const { data: meals = [] } = useFetchMeals({ onlyVisible: false });

  const visibleCount = meals.filter(
    (meal) =>
      showMealsInTable.find(([id]) => id === meal.id)?.[1].isVisible ?? true,
  ).length;

  const updateMeal = (mealId: number, isVisible: boolean, order: number) =>
    dispatch(setMealDisplay({ mealId, isVisible, order }));

  return (
    <section className="overflow-hidden rounded-lg border border-nutrition-green/25 shadow-sm">
      <header className="flex items-start justify-between gap-4 bg-dark-green px-4 py-3 text-white-green">
        <div>
          <h3 className="text-base font-semibold">
            {t("dashboardOptions.title")}
          </h3>
          <p className="text-xs text-white-green/70">
            {t("dashboardOptions.description")}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-white-green/10 px-2 py-1 text-xs font-semibold tabular-nums">
          <Eye className="h-3.5 w-3.5" aria-hidden />
          {visibleCount}/{meals.length}
        </span>
      </header>

      <div className="flex items-center gap-3 border-b border-nutrition-green/15 bg-white-green px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        <span className="w-12 text-center">
          {t("dashboardOptions.fields.order")}
        </span>
        <span className="flex-1" />
        <span>{t("dashboardOptions.fields.isVisible")}</span>
      </div>

      <ul className="divide-y divide-nutrition-green/10 bg-fade-white-green">
        {meals.map((mealType) => {
          const mealConfig = showMealsInTable.find(
            ([id]) => id === mealType.id,
          );
          const isVisible = mealConfig?.[1].isVisible ?? true;
          const order = mealConfig?.[1].order ?? mealType.order ?? 0;

          return (
            <li
              key={mealType.id}
              className="group relative flex items-center gap-3 px-4 py-2 transition-colors hover:bg-white-green"
            >
              <span
                className={`absolute inset-y-1.5 left-0 w-1 rounded-r transition-colors ${
                  isVisible ? "bg-nutrition-green" : "bg-nutrition-green/15"
                }`}
                aria-hidden
              />
              <OrderInput
                value={order}
                label={`${t("dashboardOptions.fields.order")} ${mealType.name}`}
                onCommit={(newOrder) =>
                  updateMeal(mealType.id, isVisible, newOrder)
                }
              />
              <span
                className={`flex-1 truncate text-sm font-medium transition-colors ${
                  isVisible ? "text-dark-green" : "text-text-muted line-through"
                }`}
              >
                {mealType.name}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={isVisible}
                aria-label={`${t("dashboardOptions.fields.isVisible")} ${mealType.name}`}
                onClick={() => updateMeal(mealType.id, !isVisible, order)}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nutrition-green/50 focus-visible:ring-offset-1 ${
                  isVisible ? "bg-nutrition-green" : "bg-dark-green/20"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white-green shadow transition-transform ${
                    isVisible ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default DisplayMealsForm;
