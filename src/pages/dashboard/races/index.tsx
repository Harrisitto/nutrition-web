import { useState, type ComponentType } from "react";
import { useTranslation } from "react-i18next";
import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { setSelectedDay } from "@src/store/slices/config/store";
import { BackButton } from "./components/backButton";
import { Title } from "./components/title";
import { StepProgress } from "./components/stepProgress";
import { StepNavigation } from "./components/stepNavigation";
import { RaceChart } from "./components/chart";
import { RaceDraftProvider } from "./context/raceDraftProvider";
import { RaceManager } from "./manage";
import { StepProfile } from "./steps/profile";
import { StepLandmarks } from "./steps/landmarks";
import { StepIngredients } from "./steps/ingredients";
import { RACE_STEPS, type RaceStep } from "./constants";

const STEP_CONTENT: Record<RaceStep, ComponentType> = {
  profile: StepProfile,
  landmarks: StepLandmarks,
  ingredients: StepIngredients,
};

// null: lista de carreras del día; raceId null: carrera nueva
type Editing = { raceId: number | null } | null;

const RacesPage = () => {
  const { t } = useTranslation();
  const { navigateTo } = useAppNavigation();
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState<Editing>(null);
  const [step, setStep] = useState<RaceStep>("profile");

  const openEditor = (raceId: number | null) => {
    setStep("profile");
    setEditing({ raceId });
  };

  const closeEditor = () => setEditing(null);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 animate-fade-in">
      <div className="flex items-center gap-3">
        {editing ? (
          <BackButton label={t("data:races.backToList")} onBack={closeEditor} />
        ) : (
          <BackButton
            label={t("data:races.back")}
            onBack={() => navigateTo(APP_ROUTES.DASHBOARD)}
          />
        )}
        <Title>{t("data:races.title")}</Title>
      </div>

      {editing ? (
        <RaceDraftProvider raceId={editing.raceId}>
          <StepProgress currentStep={step} onSelectStep={setStep} />
          <RaceChart />

          {/* Los pasos siguen montados al cambiar de paso: no se pierde lo escrito en sus formularios */}
          {RACE_STEPS.map((raceStep) => {
            const StepContent = STEP_CONTENT[raceStep];
            return (
              <div key={raceStep} hidden={raceStep !== step}>
                <StepContent />
              </div>
            );
          })}

          <StepNavigation
            currentStep={step}
            onSelectStep={setStep}
            onSaved={(raceDate) => {
              // La lista muestra el día de la carrera, aunque se le haya cambiado la fecha
              dispatch(setSelectedDay(raceDate));
              closeEditor();
            }}
          />
        </RaceDraftProvider>
      ) : (
        <RaceManager onEdit={openEditor} />
      )}
    </div>
  );
};

const PageNutriRaces = () => {
  const selectedUserId = useAppSelector((state) => state.config.selectedUserId);
  // Al cambiar de cliente en la barra lateral se vuelve a la lista: la carrera
  // abierta es del cliente anterior
  return <RacesPage key={selectedUserId ?? ""} />;
};

export default PageNutriRaces;
