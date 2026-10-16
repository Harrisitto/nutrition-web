import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Loader, Save } from "lucide-react";
import { primaryButtonStyle } from "@src/components/styles";
import { useSaveRacePlan } from "@src/services/tanstack/user/races";
import { useNotification } from "@src/store/slices/notification/hook";
import { useRaceDraft } from "../context/raceDraftContext";
import { RACE_STEPS, type RaceStep } from "../constants";
import { saveErrorKey } from "../validation";
import { secondaryButtonStyle } from "./formStyles";
import { useRacePosterData } from "./poster/posterData";
import { renderPosterPng } from "./poster/posterImage";

export const StepNavigation = ({
  currentStep,
  onSelectStep,
  onSaved,
}: {
  currentStep: RaceStep;
  onSelectStep: (step: RaceStep) => void;
  onSaved: (raceDate: string) => void;
}) => {
  const { t } = useTranslation();
  const { draft, issues, pendingSteps, onDraftSaved } = useRaceDraft();
  const { add: addNotification, addFormSubmitSucess } = useNotification();
  const { mutate: saveRacePlan, isPending, error } = useSaveRacePlan();
  // La imagen va en el idioma del corredor: no se guarda hasta tenerlo
  const { data: posterData, isReady: posterReady } = useRacePosterData();

  const index = RACE_STEPS.indexOf(currentStep);
  const previousStep = RACE_STEPS[index - 1];
  const nextStep = RACE_STEPS[index + 1];
  const canSave = issues.length === 0 && pendingSteps.length === 0;

  // Un aviso por paso y tipo de problema
  const stepTitle = (step: RaceStep) => t(`data:races.steps.${step}.title`);
  const warnings = [
    ...new Set([
      ...issues.map(
        (issue) => `${stepTitle(issue.step)}: ${t(`data:races.errors.${issue.key}`)}`,
      ),
      ...pendingSteps.map((step) =>
        t("data:races.pendingForm", { step: stepTitle(step) }),
      ),
    ]),
  ];

  const onSave = () =>
    saveRacePlan(
      {
        draft: { ...draft, name: draft.name.trim() },
        // La imagen que descarga el corredor se genera con los mismos datos que la vista previa
        renderImage: () => renderPosterPng(posterData),
      },
      {
        onSuccess: ({ imageUploaded }, { draft: saved }) => {
          onDraftSaved(saved);
          addFormSubmitSucess();
          if (!imageUploaded) {
            addNotification({
              type: "error",
              message: "data:races.imageUploadError",
              duration: 8000,
            });
          }
          onSaved(saved.raceDate);
        },
      },
    );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {previousStep ? (
          <button
            type="button"
            className={secondaryButtonStyle}
            onClick={() => onSelectStep(previousStep)}
          >
            <ChevronLeft size={16} />
            {t("data:races.previous")}
          </button>
        ) : (
          <span />
        )}

        {nextStep ? (
          <button
            type="button"
            className={primaryButtonStyle}
            onClick={() => onSelectStep(nextStep)}
          >
            {t("data:races.next")}
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            className={primaryButtonStyle}
            disabled={!canSave || !posterReady || isPending}
            onClick={onSave}
          >
            {isPending ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
            {t("data:races.save")}
          </button>
        )}
      </div>

      {!nextStep && warnings.length > 0 && (
        <ul className="flex flex-col items-end gap-0.5 text-right text-xs text-red-500">
          {warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      )}
      {error && (
        <p className="text-right text-sm text-red-500" role="alert">
          {t(saveErrorKey(error))}
        </p>
      )}
    </div>
  );
};
