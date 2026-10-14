import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRaceDraft } from "./context/raceDraftContext";
import { roundKm } from "./validation";
import type { RaceStep } from "./constants";

// Valor de un input numérico: "" mientras está vacío
export type NumberInput = number | "";

export const toNumberInput = (value: string): NumberInput =>
  value === "" ? "" : Number(value);

/**
 * Km de los formularios de alta (tomas y puntos de interés): entre 0 y la
 * distancia de la carrera, con el redondeo con el que se guardará.
 * km es null mientras el valor no es válido.
 */
export const useKmField = () => {
  const { draft } = useRaceDraft();
  const [value, setValue] = useState<NumberInput>("");
  const maxKm = draft.distanceKm ?? undefined;
  const isValid =
    value !== "" && value >= 0 && (maxKm === undefined || roundKm(value) <= roundKm(maxKm));

  return { value, setValue, km: isValid ? value : null, maxKm };
};

// Mensaje del error de validación de cada elemento del paso, por su índice en el borrador
export const useItemError = (step: RaceStep) => {
  const { t } = useTranslation();
  const { issues } = useRaceDraft();

  return useCallback(
    (index: number) => {
      const issue = issues.find(
        (candidate) => candidate.step === step && candidate.index === index,
      );
      return issue && t(`data:races.errors.${issue.key}`);
    },
    [issues, step, t],
  );
};
