import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader, Upload } from "lucide-react";
import { fileInputStyle, primaryButtonStyle } from "@src/components/styles";
import { useParseGpx } from "@src/services/tanstack/user/races";
import { useRaceDraft } from "../../context/raceDraftContext";

export const GpxUpload = () => {
  const { t } = useTranslation();
  const { draft, updateDraft, addUploadedGpx } = useRaceDraft();
  const [file, setFile] = useState<File | null>(null);
  const { mutate: parseGpx, isPending, error } = useParseGpx();

  const onGenerate = () => {
    if (!file) return;
    parseGpx(file, {
      onSuccess: (plan) => {
        addUploadedGpx(plan.p_gpx_path);
        updateDraft((prev) => ({
          // Se respeta el nombre si el nutricionista ya lo había escrito, también durante la subida
          name: prev.name || plan.p_name,
          distanceKm: plan.p_distance_km,
          gpxPath: plan.p_gpx_path,
          // Los tramos nuevos sustituyen a los anteriores; ingredientes y landmarks van por km
          steps: plan.p_steps,
        }));
      },
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-dashed border-nutrition-green/40 bg-white/60 p-4">
      <p className="text-sm font-semibold text-text-title">
        {t("data:races.profile.gpxTitle")}
      </p>
      <p className="text-xs text-text-muted">
        {t("data:races.profile.gpxDescription")}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="file"
          accept=".gpx,application/gpx+xml,application/xml,text/xml"
          aria-label={t("data:races.profile.gpxTitle")}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className={fileInputStyle}
        />
        <button
          type="button"
          disabled={!file || isPending}
          onClick={onGenerate}
          className={primaryButtonStyle}
        >
          {isPending ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
          {t("data:races.profile.gpxGenerate")}
        </button>
      </div>
      {draft.steps.length > 0 && (
        <p className="text-xs text-text-muted">
          {t("data:races.profile.gpxReplaceWarning")}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {t("data:races.profile.gpxError")}: {error.message}
        </p>
      )}
    </div>
  );
};
