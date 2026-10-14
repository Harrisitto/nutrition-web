import { createContext, useContext, useEffect } from "react";
import type { RacePlanDraft } from "@src/services/tanstack/user/races";
import type { RaceStep } from "../constants";
import type { DraftIssue } from "../validation";

// Cambios parciales, o una función del borrador actual si dependen de él
export type DraftUpdate =
  | Partial<RacePlanDraft>
  | ((prev: RacePlanDraft) => Partial<RacePlanDraft>);

type RaceDraftContextValue = {
  draft: RacePlanDraft;
  updateDraft: (update: DraftUpdate) => void;
  // Lo que impediría guardar, calculado a partir del borrador
  issues: DraftIssue[];
  // Pasos con un formulario de alta a medias (datos escritos sin pulsar "Añadir")
  pendingSteps: RaceStep[];
  setPendingForm: (step: RaceStep, isPending: boolean) => void;
  // Gpx subido en esta edición: si no se llega a guardar, se borra al salir
  addUploadedGpx: (path: string) => void;
  // Tras guardar: borra los gpx que la carrera ya no usa
  onDraftSaved: (saved: RacePlanDraft) => void;
};

export const RaceDraftContext = createContext<RaceDraftContextValue | null>(null);

export const useRaceDraft = () => {
  const context = useContext(RaceDraftContext);
  if (!context) {
    throw new Error("useRaceDraft must be used inside RaceDraftProvider");
  }
  return context;
};

// Avisa al borrador de que el formulario de alta del paso tiene datos sin añadir
export const usePendingForm = (step: RaceStep, isPending: boolean) => {
  const { setPendingForm } = useRaceDraft();

  useEffect(() => {
    setPendingForm(step, isPending);
  }, [step, isPending, setPendingForm]);

  useEffect(() => () => setPendingForm(step, false), [step, setPendingForm]);
};
