import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APPOINTMENT_STEPS, type AppointmentStep } from "../constants";

// Como el de carreras, pero los puntos no se abren hasta guardar la consulta
export const StepProgress = ({
  currentStep,
  canOpenPoints,
  onSelectStep,
}: {
  currentStep: AppointmentStep;
  canOpenPoints: boolean;
  onSelectStep: (step: AppointmentStep) => void;
}) => {
  const { t } = useTranslation();
  const currentIndex = APPOINTMENT_STEPS.indexOf(currentStep);
  // La barra llega hasta el círculo del paso actual
  const progress = (currentIndex / (APPOINTMENT_STEPS.length - 1)) * 100;

  return (
    <nav className="relative w-full px-6">
      {/* Línea de fondo y línea de progreso, centradas a la altura de los círculos */}
      <div className="absolute left-12 right-12 top-4 h-1 rounded-full bg-fade-green/30">
        <div
          className="h-full rounded-full bg-nutrition-green transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="relative flex justify-between">
        {APPOINTMENT_STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLocked = step === "points" && !canOpenPoints;
          const title = t(`data:appointments.form.steps.${step}.title`);

          return (
            <li key={step} className="flex w-12 flex-col items-center">
              <button
                type="button"
                disabled={isLocked}
                onClick={() => onSelectStep(step)}
                title={isLocked ? t("data:appointments.form.pointsLocked") : title}
                aria-label={title}
                aria-current={isCurrent ? "step" : undefined}
                className={`relative flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  isDone || isCurrent
                    ? "bg-nutrition-green text-white"
                    : "bg-white text-text-muted ring-2 ring-fade-green/40"
                } ${isCurrent ? "ring-4 ring-light-green/50" : ""}`}
              >
                {isDone ? <Check size={16} /> : index + 1}
              </button>
              <span
                aria-hidden="true"
                className={`mt-2 w-32 text-center text-xs ${
                  isCurrent ? "font-semibold text-text-title" : "text-text-muted"
                }`}
              >
                {title}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
