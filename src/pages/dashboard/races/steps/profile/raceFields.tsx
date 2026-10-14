import { useTranslation } from "react-i18next";
import InputComponent from "@src/components/input";
import { useRaceDraft } from "../../context/raceDraftContext";
import { fitAltitudeMarks } from "./fitAltitudeMarks";

export const RaceFields = () => {
  const { t } = useTranslation();
  const { draft, updateDraft } = useRaceDraft();

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <InputComponent.Text.SingleLine
        label={t("data:races.profile.name")}
        value={draft.name}
        required
        onChange={(e) => updateDraft({ name: e.target.value })}
      />
      <InputComponent.Date.SingleDate
        label={t("data:races.profile.date")}
        value={draft.raceDate}
        required
        onChange={(raceDate) => updateDraft({ raceDate })}
      />
      <InputComponent.Numeric
        label={t("data:races.profile.distance")}
        value={draft.distanceKm ?? ""}
        min={0}
        step="any"
        required
        onChange={(e) => {
          const distanceKm = e.target.value === "" ? null : Number(e.target.value);
          // El último tramo acaba en la distancia: sus km de altitud pueden quedar fuera
          updateDraft((prev) => ({
            distanceKm,
            steps: fitAltitudeMarks(prev.steps, distanceKm),
          }));
        }}
      />
    </div>
  );
};
