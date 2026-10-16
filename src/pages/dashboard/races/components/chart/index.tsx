import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ResponsiveContainer } from "recharts";
import { Eye } from "lucide-react";
import { secondaryButtonStyle } from "../formStyles";
import { PosterPreview } from "../poster/posterPreview";
import { ProfileChart } from "./profileChart";
import { useDraftChart } from "./useDraftChart";
import { BLUE, EDITOR_CHART_SIZES, GREEN, PURPLE } from "./constants";

// Vista previa del perfil mientras se edita; "Previsualizar" abre la imagen de la carrera
export const RaceChart = () => {
  const { t } = useTranslation();
  const { chart, landmarks, spans } = useDraftChart();
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  if (!chart) {
    return (
      <div className="rounded-2xl border border-nutrition-green/20 bg-white-green/30 px-3 py-8 text-center text-sm text-text-muted">
        {t("data:races.chart.empty")}
      </div>
    );
  }

  return (
    <figure className="flex flex-col gap-2 rounded-2xl border border-nutrition-green/20 bg-white-green/30 p-3">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ProfileChart
            chart={chart}
            landmarks={landmarks}
            spans={spans}
            sizes={EDITOR_CHART_SIZES}
            showTooltip
          />
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-2">
        <figcaption className="flex flex-wrap gap-4 text-xs text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: GREEN }} />
            {t("data:races.chart.altitude")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 border-l-2 border-dashed" style={{ borderColor: BLUE }} />
            {t("data:races.chart.landmarks")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border bg-white" style={{ borderColor: BLUE }} />
            {t("data:races.chart.ingredients")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-3 w-4 rounded-sm border"
              style={{ borderColor: PURPLE, backgroundColor: `${PURPLE}1f` }}
            />
            {t("data:races.chart.during")}
          </span>
        </figcaption>

        <button type="button" className={secondaryButtonStyle} onClick={() => setPreviewOpen(true)}>
          <Eye size={16} />
          {t("data:races.poster.preview")}
        </button>
      </div>

      {isPreviewOpen && <PosterPreview onClose={() => setPreviewOpen(false)} />}
    </figure>
  );
};
