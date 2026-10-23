import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDownToLine } from "lucide-react";
import { primaryButtonStyle } from "@src/components/styles";
import { SelectField } from "../../../../races/components/selectField";
import { emptyTextStyle } from "../../../../races/components/formStyles";
import type { Points } from "../../configPoints";

// Trae a esta consulta un punto pendiente (de la consulta sin fecha o un tema del cliente sin
// consulta). Se mueve: deja de estar pendiente
export const AddPendingPointForm = ({
  pendingPoints,
  bringPendingPoint,
  isAdding,
}: Pick<Points, "pendingPoints" | "bringPendingPoint" | "isAdding">) => {
  const { t } = useTranslation();
  // "<kind>-<id>": los ids de las dos tablas pueden coincidir
  const [selected, setSelected] = useState("");

  if (!pendingPoints.length) {
    return <p className={emptyTextStyle}>{t("data:appointments.form.points.noPending")}</p>;
  }

  const keyOf = (point: { kind: string; id: number }) => `${point.kind}-${point.id}`;
  const pendingPoint = pendingPoints.find((point) => keyOf(point) === selected);
  const canAdd = !!pendingPoint && !isAdding;

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingPoint) return;
    bringPendingPoint(pendingPoint, () => setSelected(""));
  };

  return (
    <form onSubmit={onAdd} className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_auto]">
      <SelectField
        label={t("data:appointments.form.points.pending")}
        placeholder={t("data:appointments.form.points.selectPending")}
        value={selected}
        options={pendingPoints.map((point) => {
          const tag =
            point.kind === "client"
              ? t("data:appointments.pending.clientPoint")
              : point.themeName;
          return { value: keyOf(point), label: tag ? `${point.point} · ${tag}` : point.point };
        })}
        onChange={setSelected}
      />
      <button type="submit" disabled={!canAdd} className={primaryButtonStyle}>
        <ArrowDownToLine size={16} />
        {t("data:appointments.form.points.bringPending")}
      </button>
    </form>
  );
};
