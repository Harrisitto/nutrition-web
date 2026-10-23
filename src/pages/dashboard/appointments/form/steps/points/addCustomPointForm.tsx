import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import InputComponent from "@src/components/input";
import { primaryButtonStyle } from "@src/components/styles";
import type { Points } from "../../configPoints";

// Punto personalizado: sin tematica (client_theme_id null)
export const AddCustomPointForm = ({
  addPoint,
  isAdding,
}: Pick<Points, "addPoint" | "isAdding">) => {
  const { t } = useTranslation();
  const [point, setPoint] = useState("");
  const canAdd = point.trim() !== "" && !isAdding;

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdd) return;
    addPoint({ point: point.trim() }, () => setPoint(""));
  };

  return (
    <form onSubmit={onAdd} className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_auto]">
      <InputComponent.Text.SingleLine
        label={t("data:appointments.form.points.customPoint")}
        placeholder={t("data:appointments.form.points.customPlaceholder")}
        maxLength={200}
        value={point}
        onChange={(e) => setPoint(e.target.value)}
      />
      <button type="submit" disabled={!canAdd} className={primaryButtonStyle}>
        <Plus size={16} />
        {t("data:appointments.form.points.addCustomPoint")}
      </button>
    </form>
  );
};
