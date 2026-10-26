import { useTranslation } from "react-i18next";
import { Check, ChevronLeft, ChevronRight, Loader, Play, Save, Square } from "lucide-react";
import { primaryButtonStyle } from "@src/components/styles";
import type { AppointmentStatus } from "../../../../../services/tanstack/user/appointments";
import { secondaryButtonStyle } from "../../../races/components/formStyles";
import type { AppointmentStep } from "../constants";

// Siguiente estado al pulsar el botón de la consulta: programada -> en curso -> tratada
const NEXT_STATUS = {
  scheduled: { status: "in_progress", label: "startAppointment", Icon: Play },
  in_progress: { status: "done", label: "finishAppointment", Icon: Square },
} as const;

// Empezar / Terminar consulta. Ya tratada solo muestra el estado
const StatusButton = ({
  status,
  isChanging,
  onChange,
}: {
  status: AppointmentStatus;
  isChanging: boolean;
  onChange: (status: AppointmentStatus) => void;
}) => {
  const { t } = useTranslation();

  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-text-muted">
        <Check size={16} />
        {t("data:appointments.form.appointmentDone")}
      </span>
    );
  }

  const { status: next, label, Icon } = NEXT_STATUS[status];
  return (
    <button
      type="button"
      className={`${secondaryButtonStyle} disabled:opacity-50`}
      disabled={isChanging}
      onClick={() => onChange(next)}
    >
      {isChanging ? <Loader size={16} className="animate-spin" /> : <Icon size={16} />}
      {t(`data:appointments.form.${label}`)}
    </button>
  );
};

// Paso 1: "Guardar y continuar" guarda la consulta y pasa a los puntos. En los demás pasos los
// puntos y notas se guardan al añadirlos: "Guardar" vuelve a guardar los datos y vuelve a la lista
export const StepNavigation = ({
  currentStep,
  isSaving,
  errorKey,
  status,
  isChangingStatus,
  onPrevious,
  onSaveDetails,
  onSave,
  onChangeStatus,
}: {
  currentStep: AppointmentStep;
  isSaving: boolean;
  errorKey: string | null;
  // null: consulta sin guardar o sin fecha, no se puede empezar
  status: AppointmentStatus | null;
  isChangingStatus: boolean;
  onPrevious: () => void;
  onSaveDetails: () => void;
  onSave: () => void;
  onChangeStatus: (status: AppointmentStatus) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {currentStep === "points" ? (
          <button type="button" className={secondaryButtonStyle} onClick={onPrevious}>
            <ChevronLeft size={16} />
            {t("data:appointments.form.previous")}
          </button>
        ) : (
          <span />
        )}

        <div className="flex flex-wrap items-center justify-end gap-2">
          {status !== null && (
            <StatusButton status={status} isChanging={isChangingStatus} onChange={onChangeStatus} />
          )}
          {currentStep === "details" ? (
            <button
              type="button"
              className={primaryButtonStyle}
              disabled={isSaving}
              onClick={onSaveDetails}
            >
              {t("data:appointments.form.saveAndContinue")}
              {isSaving ? <Loader size={16} className="animate-spin" /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <button
              type="button"
              className={primaryButtonStyle}
              disabled={isSaving}
              onClick={onSave}
            >
              {isSaving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
              {t("data:appointments.form.save")}
            </button>
          )}
        </div>
      </div>

      {errorKey && (
        <p className="text-right text-sm text-red-500" role="alert">
          {t(errorKey)}
        </p>
      )}
    </div>
  );
};
