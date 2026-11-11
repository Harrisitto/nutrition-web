import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageUp, Loader } from "lucide-react";
import { fileInputStyle, primaryButtonStyle } from "@src/components/styles";
import {
  checkProfileImage,
  PROFILE_IMAGE_TYPES,
  ProfileImageError,
  raceProfileFromImage,
} from "@src/helpers/races/profileImage";
import { useReadProfileImage } from "@src/services/tanstack/user/races";
import { useRaceDraft } from "../../context/raceDraftContext";

// Para carreras sin gpx: la organización casi siempre publica la gráfica del perfil
export const ProfileImageUpload = () => {
  const { t } = useTranslation();
  const { draft, updateDraft } = useRaceDraft();
  const [file, setFile] = useState<File | null>(null);
  const [profileError, setProfileError] = useState<ProfileImageError | null>(null);
  const { mutate: readImage, isPending, error: readError } = useReadProfileImage();

  const onGenerate = () => {
    if (!file || isPending) return;

    try {
      checkProfileImage(file);
      setProfileError(null);
    } catch (error) {
      setProfileError(error as ProfileImageError);
      return;
    }

    readImage(file, {
      onSuccess: (profile) => {
        let plan;
        try {
          plan = raceProfileFromImage(profile, file.name);
        } catch (error) {
          setProfileError(
            error instanceof ProfileImageError ? error : new ProfileImageError("noProfile"),
          );
          return;
        }

        updateDraft((prev) => ({
          name: prev.name || plan.name,
          distanceKm: plan.distanceKm,
          // Los tramos nuevos sustituyen a los anteriores; ingredientes y landmarks van por km
          steps: plan.steps,
        }));
      },
    });
  };

  const errorMessage = profileError
    ? t(`data:races.profile.imageErrors.${profileError.key}`)
    : readError && t("data:races.profile.imageErrors.readFailed");

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-dashed border-nutrition-green/40 bg-white/60 p-4">
      <p className="text-sm font-semibold text-text-title">
        {t("data:races.profile.imageTitle")}
      </p>
      <p className="text-xs text-text-muted">
        {t("data:races.profile.imageDescription")}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="file"
          accept={PROFILE_IMAGE_TYPES.join(",")}
          aria-label={t("data:races.profile.imageTitle")}
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setProfileError(null);
          }}
          className={fileInputStyle}
        />
        <button
          type="button"
          disabled={!file || isPending}
          onClick={onGenerate}
          className={primaryButtonStyle}
        >
          {isPending ? <Loader size={16} className="animate-spin" /> : <ImageUp size={16} />}
          {t("data:races.profile.gpxGenerate")}
        </button>
      </div>
      {isPending && (
        <p className="text-xs text-text-muted">{t("data:races.profile.imageReading")}</p>
      )}
      {draft.steps.length > 0 && (
        <p className="text-xs text-text-muted">
          {t("data:races.profile.gpxReplaceWarning")}
        </p>
      )}
      {errorMessage && (
        <p className="text-sm text-red-500" role="alert">
          {t("data:races.profile.imageError")}: {errorMessage}
        </p>
      )}
    </div>
  );
};
