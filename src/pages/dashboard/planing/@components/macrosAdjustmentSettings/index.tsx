import { useTranslation } from "react-i18next";
import { WandSparkles } from "lucide-react";
import InputComponent from "@src/components/input";
import { setAutoAdjustMeals } from "@src/store/slices/config/store";
import { useAppDispatch, useAppSelector } from "@src/store/store";

type AutoAdjustOption = "onTrainingKcalChange" | "onTrainingCarbsChange";

const OPTIONS: AutoAdjustOption[] = ["onTrainingKcalChange", "onTrainingCarbsChange"];

// Cuando se recalculan solas las comidas del dia al cambiar el entrenamiento.
// w-0 min-w-full: ocupa el ancho del calendario de encima sin ensancharlo con el texto
export const AutoAdjustMeals = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const autoAdjustMeals = useAppSelector((state) => state.config.autoAdjustMeals);

  return (
    <section className="w-0 min-w-full overflow-hidden rounded-2xl border border-nutrition-green/20 bg-white shadow-sm">
      <header className="flex items-start gap-2 border-b border-nutrition-green/10 px-4 py-3">
        <WandSparkles size={16} className="mt-0.5 shrink-0 text-nutrition-green" aria-hidden />
        <div>
          <h3 className="text-sm font-semibold text-dark-green">
            {t("data:planing.autoAdjustMeals.title")}
          </h3>
          <p className="text-xs text-dark-green/60">
            {t("data:planing.autoAdjustMeals.description")}
          </p>
        </div>
      </header>

      <ul className="divide-y divide-nutrition-green/10">
        {OPTIONS.map((option) => (
          <li key={option}>
            <label className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-white-green">
              <span className="text-sm font-medium text-dark-green">
                {t(`data:planing.autoAdjustMeals.${option}`)}
              </span>
              <InputComponent.Toggle
                checked={autoAdjustMeals[option]}
                onChange={(checked) => dispatch(setAutoAdjustMeals({ [option]: checked }))}
              />
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
};
