import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader, Upload } from "lucide-react";
import { fileInputStyle, primaryButtonStyle } from "@src/components/styles";
import { GpxError, parseRaceGpx } from "@src/helpers/races/gpx";
import { useUploadGpx } from "@src/services/tanstack/user/races";
import { useRaceDraft } from "../../context/raceDraftContext";

export const GpxUpload = () => {
  const { t } = useTranslation();
  const { draft, updateDraft, addUploadedGpx } = useRaceDraft();
  const [file, setFile] = useState<File | null>(null);
  const [parseError, setParseError] = useState<GpxError | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const { mutate: uploadGpx, isPending: isUploading, error: uploadError } = useUploadGpx();
  // También mientras se lee el fichero: un doble click no lo procesa ni sube dos veces
  const isPending = isParsing || isUploading;

  const onGenerate = async () => {
    if (!file || isPending) return;

    // Primero se procesa: un gpx que no sirve no llega a subirse
    let plan;
    setIsParsing(true);
    try {
      plan = parseRaceGpx(await file.text(), file.name);
      setParseError(null);
    } catch (error) {
      setParseError(error instanceof GpxError ? error : new GpxError("invalidFile"));
      return;
    } finally {
      setIsParsing(false);
    }

    uploadGpx(file, {
      onSuccess: (gpxPath) => {
        addUploadedGpx(gpxPath);
        updateDraft((prev) => ({
          // Se respeta el nombre si el nutricionista ya lo había escrito, también durante la subida
          name: prev.name || plan.name,
          distanceKm: plan.distanceKm,
          gpxPath,
          // Los tramos nuevos sustituyen a los anteriores; ingredientes y landmarks van por km
          steps: plan.steps,
        }));
      },
    });
  };

  const errorMessage = parseError
    ? t(`data:races.profile.gpxErrors.${parseError.key}`)
    : uploadError?.message;

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
      {errorMessage && (
        <p className="text-sm text-red-500" role="alert">
          {t("data:races.profile.gpxError")}: {errorMessage}
        </p>
      )}
    </div>
  );
};
