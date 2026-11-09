import { useTranslation } from "react-i18next";
import { SlidersHorizontal } from "lucide-react";
import InputComponent from "@src/components/input";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { setDefaults } from "@src/store/slices/config/store";
import type { DefaultsState } from "@src/store/slices/config/store";

const OPTIONS: (keyof DefaultsState)[] = ["displayDefaultNutritionistRecipes"];

// Valores con los que se abren los selectores de la tabla de planificación (config.defaults)
const DefaultsForm = () => {
  const { t } = useTranslation("forms");
  const dispatch = useAppDispatch();
  const defaults = useAppSelector((state) => state.config.defaults);

  return (
    <section className="overflow-hidden rounded-lg border border-nutrition-green/25 shadow-sm">
      <header className="flex items-start gap-3 bg-dark-green px-4 py-3 text-white-green">
        <SlidersHorizontal className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <div>
          <h3 className="text-base font-semibold">{t("tableDefaults.title")}</h3>
          <p className="text-xs text-white-green/70">{t("tableDefaults.description")}</p>
        </div>
      </header>

      <ul className="divide-y divide-nutrition-green/10 bg-fade-white-green">
        {OPTIONS.map((option) => (
          <li key={option}>
            <label className="flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white-green">
              <span className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-dark-green">
                  {t(`tableDefaults.options.${option}.label`)}
                </span>
                <span className="text-xs text-text-muted">
                  {t(`tableDefaults.options.${option}.description`)}
                </span>
              </span>
              <InputComponent.Toggle
                checked={defaults[option]}
                onChange={(checked) => dispatch(setDefaults({ [option]: checked }))}
              />
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DefaultsForm;
