import { useTranslation } from "react-i18next";
import { Check, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { primaryButtonStyle } from "@src/components/styles";
import { secondaryButtonStyle } from "../../../races/components/formStyles";
import type { AppointmentStep } from "../constants";

// Paso 1: "Guardar y continuar" guarda la consulta. Paso 2: los puntos se guardan al añadirlos,
// "Terminar" solo vuelve a la lista
export const StepNavigation = ({
  currentStep,
  isSaving,
  errorKey,
  onPrevious,
  onSaveDetails,
  onFinish,
}: {
  currentStep: AppointmentStep;
  isSaving: boolean;
  errorKey: string | null;
  onPrevious: () => void;
  onSaveDetails: () => void;
  onFinish: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {currentStep === "points" ? (
          <button type="button" className={secondaryButtonStyle} onClick={onPrevious}>
            <ChevronLeft size={16} />
            {t("data:appointments.form.previous")}
          </button>
        ) : (
          <span />
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
          <button type="button" className={primaryButtonStyle} onClick={onFinish}>
            <Check size={16} />
            {t("data:appointments.form.finish")}
          </button>
        )}
      </div>

      {errorKey && (
        <p className="text-right text-sm text-red-500" role="alert">
          {t(errorKey)}
        </p>
      )}
    </div>
  );
};
