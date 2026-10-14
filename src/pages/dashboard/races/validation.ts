import type { RacePlanDraft } from "@src/services/tanstack/user/races";
import type { RaceStep } from "./constants";

// Claves de data:races.errors.*
export type DraftIssueKey =
  | "missingName"
  | "missingDate"
  | "missingDistance"
  | "stepOutOfRange"
  | "stepAltitudeOutOfRange"
  | "stepAltitudeOrder"
  | "stepNegativeElevation"
  | "stepInvalidTime"
  | "landmarkOutOfRange"
  | "landmarkDuplicated"
  | "ingredientOutOfRange"
  | "ingredientInvalidAmount";

// index: posición del tramo, punto de interés o toma en el borrador
export type DraftIssue = { step: RaceStep; key: DraftIssueKey; index?: number };

// La base de datos guarda los km con 3 decimales: se valida con el valor que se guardará
export const roundKm = (km: number) => Math.round(km * 1000) / 1000;

// Formato de interval que devuelve la base de datos (hh:mm:ss) o que se escribe a mano (hh:mm)
const TIME_PATTERN = /^\d+:[0-5]\d(:[0-5]\d)?$/;

/**
 * Las mismas comprobaciones que save_race_plan y las restricciones de sus
 * tablas, para avisar antes de guardar en vez de mostrar el error de la base
 * de datos. Los rangos solo se comprueban si hay distancia.
 */
export const validateRaceDraft = (draft: RacePlanDraft): DraftIssue[] => {
  const issues: DraftIssue[] = [];
  const add = (step: RaceStep, key: DraftIssueKey, index?: number) =>
    issues.push({ step, key, index });

  const distance =
    draft.distanceKm !== null && draft.distanceKm > 0
      ? roundKm(draft.distanceKm)
      : null;
  const isAfterEnd = (km: number) => distance !== null && km > distance;

  if (!draft.name.trim()) add("profile", "missingName");
  if (!draft.raceDate) add("profile", "missingDate");
  if (distance === null) add("profile", "missingDistance");

  // Cada tramo acaba donde empieza el siguiente (el último en la distancia)
  const steps = draft.steps
    .map((step, index) => ({ step, index, km: roundKm(step.km_start) }))
    .sort((a, b) => a.km - b.km);
  steps.forEach(({ step, index, km }, position) => {
    const kmEnd = steps[position + 1]?.km ?? distance;
    if (km < 0 || (kmEnd !== null && km >= kmEnd)) {
      add("profile", "stepOutOfRange", index);
    }
    const isOutside = (at: number | null) =>
      at !== null && (roundKm(at) < km || (kmEnd !== null && roundKm(at) > kmEnd));
    if (isOutside(step.min_altitude_at) || isOutside(step.max_altitude_at)) {
      add("profile", "stepAltitudeOutOfRange", index);
    }
    if (
      step.min_altitude !== null &&
      step.max_altitude !== null &&
      step.min_altitude > step.max_altitude
    ) {
      add("profile", "stepAltitudeOrder", index);
    }
    if ((step.elevation_gain ?? 0) < 0 || (step.elevation_loss ?? 0) < 0) {
      add("profile", "stepNegativeElevation", index);
    }
    if (step.aprox_time_start !== null && !TIME_PATTERN.test(step.aprox_time_start)) {
      add("profile", "stepInvalidTime", index);
    }
  });

  // Un mismo tipo de punto de interés solo una vez por km
  const landmarkKeys = new Set<string>();
  draft.landmarks.forEach((landmark, index) => {
    const km = roundKm(landmark.km);
    if (km < 0 || isAfterEnd(km)) add("landmarks", "landmarkOutOfRange", index);
    const key = `${landmark.landmark_id}-${km}`;
    if (landmarkKeys.has(key)) add("landmarks", "landmarkDuplicated", index);
    landmarkKeys.add(key);
  });

  draft.ingredients.forEach((intake, index) => {
    const km = roundKm(intake.km);
    const kmEnd = roundKm(km + (intake.km_span ?? 0));
    if (km < 0 || isAfterEnd(km) || isAfterEnd(kmEnd)) {
      add("ingredients", "ingredientOutOfRange", index);
    }
    if (!(intake.amount > 0) || (intake.km_span !== null && !(intake.km_span > 0))) {
      add("ingredients", "ingredientInvalidAmount", index);
    }
  });

  return issues;
};

// Errores de save_race_plan que la validación no puede prever (p. ej. un
// ingrediente borrado desde otra pestaña), por SQLSTATE y mensaje
const SAVE_ERRORS: { code: string; message?: string; key: string }[] = [
  { code: "22023", message: "Race step out of range", key: "stepOutOfRange" },
  { code: "22023", message: "Race ingredient out of range", key: "ingredientOutOfRange" },
  { code: "22023", message: "Race landmark out of range", key: "landmarkOutOfRange" },
  { code: "22023", message: "Deleted ingredient", key: "deletedIngredient" },
  { code: "22007", key: "stepInvalidTime" },
  { code: "23505", key: "duplicated" },
  { code: "23514", key: "invalidValue" },
  { code: "P0002", key: "raceNotFound" },
];

// Clave i18n del error al guardar una carrera
export const saveErrorKey = (error: Error) => {
  const code = "code" in error ? String(error.code) : "";
  const match = SAVE_ERRORS.find(
    (candidate) =>
      candidate.code === code &&
      (!candidate.message || error.message.includes(candidate.message)),
  );
  return match ? `data:races.errors.${match.key}` : "data:races.saveError";
};
