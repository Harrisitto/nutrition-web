import { useDeleteMeasures } from "@src/services/tanstack/user/measures";
import { useTranslation } from "react-i18next";
import { usePlotContext } from "../plotContext";

export const ManageMeasures = () => {
  const { t } = useTranslation();
  const { focusedMeasures, measureInfo } = usePlotContext();
  const deleteMeasureQuery = useDeleteMeasures();

  return (
    <section className="mt-4 rounded-lg border border-slate-200 bg-white p-3 h-auto overflow-y-auto max-h-128">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-700">{t("forms:measures.management.visibleMeasuresTitle")}</h3>
        <p className="text-xs text-slate-500">{t("forms:measures.management.visibleMeasuresDescription")}</p>
      </div>

      {focusedMeasures.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          {t("forms:measures.management.noVisibleMeasuresInRange")}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {focusedMeasures.map((focusedMeasure, index) => {
            const measureDetails = measureInfo[focusedMeasure.measure_id];
            if (!measureDetails) return null;

            const measureKey = `${focusedMeasure.measure_id}-${focusedMeasure.date}-${index}`;

            return (
              <article
                key={measureKey}
                className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <div
                  className={`h-3 w-3 shrink-0 rounded-full ${measureDetails.colorClass}`}
                />

                <span className="text-xs text-slate-600">{focusedMeasure.date}</span>
                <span className="text-sm font-medium text-slate-800">{measureDetails.data.name.toLocaleUpperCase()}</span>
                <span className="ml-auto text-sm font-semibold text-slate-800">{focusedMeasure.value}</span>
                <span className="text-xs text-slate-500">{measureDetails.data.units}</span>

                <button
                  className="rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
                  onClick={() => {
                    deleteMeasureQuery.mutate({
                        measureId: focusedMeasure.measure_id,
                        date: focusedMeasure.date,
                    });
                  }}
                  disabled={deleteMeasureQuery.isPending}
                >
                  {t("forms:measures.management.delete")}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
