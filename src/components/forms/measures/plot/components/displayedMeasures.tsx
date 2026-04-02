import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { usePlotContext } from "../plotContext";
import { getChartColorFromClass } from "../../../../../hooks/helpers/colorMapping";
import { useTranslation } from "react-i18next";

export const DisplayedMeasures = () => {
  const { t } = useTranslation();
  const { measureInfo, setMeasureVisible } = usePlotContext();
  const entries = Object.entries(measureInfo);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">{t("forms:measures.management.displayedMeasuresTitle")}</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 transition hover:bg-slate-100"
            onClick={() => {
              setMeasureVisible(
                entries.map(([id]) => ({
                  id: Number(id),
                  visible: false,
                })),
              );
            }}
          >
            <EyeClosedIcon className="h-3.5 w-3.5" />
            {t("forms:measures.management.hideAll")}
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 transition hover:bg-slate-100"
            onClick={() => {
              setMeasureVisible(
                entries.map(([id]) => ({
                  id: Number(id),
                  visible: true,
                })),
              );
            }}
          >
            <EyeIcon className="h-3.5 w-3.5" />
            {t("forms:measures.management.showAll")}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {entries.map(([id, info]) => (
          <button
            key={`measure-list-${id}`}
            type="button"
            className={`w-full rounded-md border px-3 py-2 text-left transition ${
              info.visible
                ? "border-slate-200 bg-slate-50 hover:bg-slate-100"
                : "border-slate-200 bg-white opacity-60 hover:opacity-80"
            }`}
            onClick={() =>
              setMeasureVisible([{ id: Number(id), visible: !info.visible }])
            }
          >
            <div className="flex items-start gap-3">
              <svg
                className="mt-1 h-3 w-3 shrink-0"
                viewBox="0 0 12 12"
                aria-hidden="true"
              >
                <circle cx="6" cy="6" r="5" fill={getChartColorFromClass(info.colorClass)} stroke="#cbd5e1" />
              </svg>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {String(info.data.name ?? t("forms:measures.management.measureFallback", { id })).toLocaleUpperCase()}
                  </p>
                  {info.data.units ? (
                    <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                      {String(info.data.units)}
                    </span>
                  ) : null}
                </div>
                {info.data.description ? (
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {String(info.data.description)}
                  </p>
                ) : null}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
