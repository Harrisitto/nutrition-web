import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import InputComponent from "@src/components/input";
import { primaryButtonStyle } from "@src/components/styles";
import { usePendingForm, useRaceDraft } from "../../context/raceDraftContext";
import { SelectField } from "../../components/selectField";
import { toNumberInput, useKmField } from "../../hooks";

export const AddLandmarkForm = ({
  options,
}: {
  options: { id: number; name: string }[];
}) => {
  const { t } = useTranslation();
  const { updateDraft } = useRaceDraft();
  const kmField = useKmField();
  const [landmarkId, setLandmarkId] = useState("");
  const [name, setName] = useState("");

  // El tipo se conserva tras añadir: no cuenta como dato sin añadir
  usePendingForm("landmarks", kmField.value !== "" || name.trim() !== "");

  const { km } = kmField;
  const canAdd = !!landmarkId && km !== null;

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landmarkId || km === null) return;
    updateDraft((prev) => ({
      landmarks: [
        ...prev.landmarks,
        { landmark_id: Number(landmarkId), km, name: name.trim() },
      ],
    }));
    kmField.setValue("");
    setName("");
  };

  return (
    <form
      onSubmit={onAdd}
      className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_8rem_1fr_auto]"
    >
      <SelectField
        label={t("data:races.landmarks.type")}
        placeholder={t("data:races.landmarks.selectType")}
        value={landmarkId}
        options={options.map((option) => ({ value: option.id, label: option.name }))}
        onChange={setLandmarkId}
      />
      <InputComponent.Numeric
        label={t("data:races.landmarks.km")}
        required
        min={0}
        max={kmField.maxKm}
        step="any"
        value={kmField.value}
        onChange={(e) => kmField.setValue(toNumberInput(e.target.value))}
      />
      <InputComponent.Text.SingleLine
        label={t("data:races.landmarks.name")}
        placeholder={t("data:races.landmarks.namePlaceholder")}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" disabled={!canAdd} className={primaryButtonStyle}>
        <Plus size={16} />
        {t("data:races.landmarks.add")}
      </button>
    </form>
  );
};
