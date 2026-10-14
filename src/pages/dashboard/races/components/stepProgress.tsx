import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RACE_STEPS, type RaceStep } from "../constants";
import { useRaceDraft } from "../context/raceDraftContext";

export const StepProgress = ({
  currentStep,
  onSelectStep,
}: {
  currentStep: RaceStep;
  onSelectStep: (step: RaceStep) => void;
}) => {
  const { t } = useTranslation();
  const { issues, pendingSteps } = useRaceDraft();
  const currentIndex = RACE_STEPS.indexOf(currentStep);
  // La barra llega hasta el círculo del paso actual
  const progress = (currentIndex / (RACE_STEPS.length - 1)) * 100;

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
        {RACE_STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          // Algo impide guardar o hay datos sin añadir en el formulario del paso
          const needsAttention =
            issues.some((issue) => issue.step === step) || pendingSteps.includes(step);
          const title = t(`data:races.steps.${step}.title`);

          return (
            <li key={step} className="flex w-12 flex-col items-center">
              <button
                type="button"
                onClick={() => onSelectStep(step)}
                aria-label={
                  needsAttention ? `${title} · ${t("data:races.stepNeedsAttention")}` : title
                }
                aria-current={isCurrent ? "step" : undefined}
                className={`relative flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  isDone || isCurrent
                    ? "bg-nutrition-green text-white"
                    : "bg-white text-text-muted ring-2 ring-fade-green/40"
                } ${isCurrent ? "ring-4 ring-light-green/50" : ""}`}
              >
                {isDone ? <Check size={16} /> : index + 1}
                {needsAttention && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                )}
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
