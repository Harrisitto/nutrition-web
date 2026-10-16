import { useMemo } from "react";
import { useRaceIngredientCatalog } from "@src/services/tanstack/data/raceIngredients";
import { useFetchRaceLandmarkOptions } from "@src/services/tanstack/data/raceLandmarks";
import { useRaceDraft } from "../../context/raceDraftContext";
import { buildChartData, chartSpans, resolveLandmarks } from "./chartData";

/**
 * Lo que pinta el perfil del borrador: los puntos del perfil (null si aún no hay altitudes),
 * los puntos de interés con su nombre e icono y las franjas de las tomas con "durante".
 */
export const useDraftChart = () => {
  const { draft } = useRaceDraft();
  // Con los ingredientes borrados del catálogo: siguen en la carrera
  const { byId: catalog } = useRaceIngredientCatalog();
  const { data: landmarkOptions } = useFetchRaceLandmarkOptions();

  const chart = useMemo(
    () =>
      buildChartData({
        steps: draft.steps,
        ingredients: draft.ingredients,
        distanceKm: draft.distanceKm,
        catalog,
      }),
    [draft.steps, draft.ingredients, draft.distanceKm, catalog],
  );

  const landmarks = useMemo(
    () => resolveLandmarks(draft.landmarks, landmarkOptions),
    [draft.landmarks, landmarkOptions],
  );

  const spans = useMemo(() => chartSpans(draft.ingredients), [draft.ingredients]);

  return { chart, landmarks, spans };
};
