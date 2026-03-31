import { useTranslation } from "react-i18next";
import { Context, fieldIds, useContextFormPreset, useFormPreset } from "./hook";
import { useInsert } from "./insert";
import { useFetchBmr, useFetchUserWeightForDateRange } from "@src/services/tanstack/user/info";
import { fromDate } from "@src/helpers/dates";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const value = useFormPreset();

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const FieldMeal = () => {
  const formPreset = useContextFormPreset();
  if (!formPreset) return null;
  return formPreset.Fields.filter((field) =>
    fieldIds.meal.isId(field.key ?? ""),
  );
};

export const FieldTrainingHc = () => {
  const formPreset = useContextFormPreset();
  if (!formPreset) return null;
  return formPreset.Fields.filter((field) =>
    fieldIds.trainingHc.isId(field.key ?? ""),
  );
};

export const FieldText = () => {
  const formPreset = useContextFormPreset();
  if (!formPreset) return null;
  return formPreset.Fields.filter((field) => {
    const key = field.key ?? "";
    return key === fieldIds.name || key === fieldIds.comment;
  });
};

export const Resume = () => {
  const formPreset = useContextFormPreset();
  const weekDate = fromDate(new Date());
  
  const userBmr = useFetchBmr({
    startDate: weekDate.thisMonday(),
    endDate: weekDate.thisSunday(),
  });
  const userWeight = useFetchUserWeightForDateRange({
    startDate: weekDate.thisMonday(),
    endDate: weekDate.thisSunday(),
  });

  const { t } = useTranslation();
  if (!formPreset) return null;
  const data = formPreset.derivedState;
  if (!data) return null;

  const weight = userWeight.data ?? 0;
  const bmr = userBmr.data ?? 0;
  const balanceKcal = data.totalKcal - bmr;
  const carbsPerKg = weight > 0 ? data.totalCarbs / weight : 0;
  const fatsPerKg = weight > 0 ? data.totalFat / weight : 0;
  const proteinPerKg = weight > 0 ? data.totalProtein / weight : 0;

  return (
    <div className="mt-3">
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center justify-between rounded-md bg-white px-3 py-2">
          <h3 className="text-sm font-medium text-text-muted">
            {t("forms:preset.fields.mealsKcal")}
          </h3>
          <p className="text-base font-semibold text-text-title">{data.mealKcal}</p>
        </div>

        <div className="flex items-center justify-between rounded-md bg-white px-3 py-2">
          <h3 className="text-sm font-medium text-text-muted">
            {t("forms:preset.fields.trainingKcal")}
          </h3>
          <p className="text-base font-semibold text-text-title">{data.trainingKcal}</p>
        </div>

        <div className="flex items-center justify-between rounded-md border border-nutrition-green/20 bg-nutrition-green/10 px-3 py-2">
          <h3 className="text-sm font-semibold text-text-subtitle">
            {t("forms:preset.fields.totalKcal")}
          </h3>
          <p className="text-lg font-bold text-dark-green">{data.totalKcal}</p>
        </div>

        <div className="flex items-center justify-between rounded-md bg-white px-3 py-2">
          <h3 className="text-sm font-medium text-text-muted">
            {t("forms:preset.fields.balanceKcal")}
          </h3>
          <p className="text-base font-semibold text-text-title">{balanceKcal.toFixed(0)}</p>
        </div>

        <div className="flex items-center justify-between rounded-md bg-white px-3 py-2">
          <h3 className="text-sm font-medium text-text-muted">
            {t("forms:preset.fields.carbsPerKg")}
          </h3>
          <p className="text-base font-semibold text-text-title">{carbsPerKg.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between rounded-md bg-white px-3 py-2">
          <h3 className="text-sm font-medium text-text-muted">
            {t("forms:preset.fields.fatsPerKg")}
          </h3>
          <p className="text-base font-semibold text-text-title">{fatsPerKg.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between rounded-md bg-white px-3 py-2">
          <h3 className="text-sm font-medium text-text-muted">
            {t("forms:preset.fields.proteinPerKg")}
          </h3>
          <p className="text-base font-semibold text-text-title">{proteinPerKg.toFixed(2)}</p>
        </div>
        

      </div>
    </div>
  );
};

export const InsertData = () => {
  const formPreset = useContextFormPreset();
  const { onSubmit } = useInsert();
  const { t } = useTranslation();
  if (!formPreset) return null;
  return (
    <button
      type="button"
      onClick={onSubmit}
      className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-nutrition-green px-4 py-2 text-sm font-semibold text-white-green transition-colors hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-nutrition-green/50 focus:ring-offset-2 cursor-pointer"
    >
      {t("forms:preset.fields.submit")}
    </button>
  );
};
