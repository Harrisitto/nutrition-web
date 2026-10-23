import { useTranslation } from "react-i18next";
import { Circle, CircleCheck, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { deleteButtonStyle } from "@src/components/styles";
import type { PointKind } from "../../../../../../services/tanstack/user/appointments";
import {
  emptyTextStyle,
  listItemStyle,
  pointTagStyle,
} from "../../../../races/components/formStyles";
import { useFormAppointmentPoints } from "../../configPoints";
import { StepSection } from "../../components/stepSection";
import { AddThemePointForm } from "./addThemePointForm";
import { AddCustomPointForm } from "./addCustomPointForm";
import { AddPendingPointForm } from "./addPendingPointForm";

export const StepPoints = ({ appointmentId }: { appointmentId: number }) => {
  const { t } = useTranslation();
  const {
    points,
    clientPoints,
    themes,
    isDated,
    pendingPoints,
    addPoint,
    bringPendingPoint,
    removePoint,
    setPointTreated,
    isSettingTreated,
    isAdding,
    isRemoving,
    isLoading,
    isLoadError,
    error,
  } = useFormAppointmentPoints(appointmentId);

  if (isLoading) return null;

  // Sin las tematicas el formulario diria que no hay ninguna asignada
  if (isLoadError) {
    return (
      <p className="text-sm text-red-500" role="alert">
        {t("data:appointments.form.errors.load")}
      </p>
    );
  }

  const removeLabel = t("data:appointments.form.points.remove");

  // Fila de un punto: casilla de tratado, texto, etiqueta y (si no esta tratado) quitar
  const renderPoint = ({
    kind,
    id,
    point,
    treated,
    tag,
    removable,
  }: {
    kind: PointKind;
    id: number;
    point: string;
    treated: boolean;
    tag: string | null;
    removable: boolean;
  }): ReactNode => {
    const treatedLabel = treated
      ? t("data:appointments.form.points.unmarkTreated")
      : t("data:appointments.form.points.markTreated");

    return (
      <li key={`${kind}-${id}`} className={`${listItemStyle()} text-sm`}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            title={treatedLabel}
            aria-label={treatedLabel}
            aria-pressed={treated}
            disabled={isSettingTreated}
            onClick={() => setPointTreated({ kind, id, treated: !treated })}
            className={pointStyles.treatedButton}
          >
            {treated ? <CircleCheck size={18} /> : <Circle size={18} />}
          </button>
          <span className={treated ? pointStyles.textTreated : pointStyles.text}>{point}</span>
          {tag && <span className={pointTagStyle}>{tag}</span>}
          {/* Un punto tratado no se borra: hay que desmarcarlo antes */}
          {removable && !treated && (
            <button
              type="button"
              title={removeLabel}
              aria-label={removeLabel}
              disabled={isRemoving}
              onClick={() => removePoint(id)}
              className={deleteButtonStyle}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </li>
    );
  };

  return (
    <StepSection step="points">
      {/* Primero los del nutricionista y despues los del cliente, como en la lista */}
      {points.length === 0 && clientPoints.length === 0 ? (
        <p className={emptyTextStyle}>{t("data:appointments.pending.noPoints")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {points.map((point) =>
            renderPoint({
              kind: "nutri",
              id: point.id,
              point: point.point,
              treated: point.treated_at !== null,
              tag: point.client_themes?.theme_name ?? null,
              removable: true,
            }),
          )}
          {/* Los temas del cliente los borra el cliente: aqui solo se marcan */}
          {clientPoints.map((point) =>
            renderPoint({
              kind: "client",
              id: point.id,
              point: point.point,
              treated: point.treated_at !== null,
              tag: t("data:appointments.pending.clientPoint"),
              removable: false,
            }),
          )}
        </ul>
      )}

      <div className="flex flex-col gap-4 border-t border-fade-green pt-4">
        {isDated && (
          <AddPendingPointForm
            pendingPoints={pendingPoints}
            bringPendingPoint={bringPendingPoint}
            isAdding={isAdding}
          />
        )}
        <AddThemePointForm themes={themes} addPoint={addPoint} isAdding={isAdding} />
        <AddCustomPointForm addPoint={addPoint} isAdding={isAdding} />
      </div>

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {t("data:appointments.form.errors.points")}
        </p>
      )}
    </StepSection>
  );
};

const pointStyles = {
  text: "flex-1 text-text-body",
  textTreated: "flex-1 text-text-muted line-through",
  treatedButton:
    "shrink-0 rounded-md p-1 text-nutrition-green transition hover:bg-white-green/60 disabled:opacity-50",
} as const;
