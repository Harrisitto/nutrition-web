import { useMemo } from "react";
import { hcToKcal, raceHc } from "@src/helpers/nutrition";
import { toSupportedLanguage } from "@src/hooks/helpers/language";
import type { SupportedLanguage } from "@src/services/i18n/config";
import {
  useRaceIngredientCatalog,
  type RaceIngredient,
} from "@src/services/tanstack/data/raceIngredients";
import { useFetchRaceLandmarkOptions } from "@src/services/tanstack/data/raceLandmarks";
import type { RacePlanDraft } from "@src/services/tanstack/user/races";
import { useFetchSingleUser } from "@src/services/tanstack/user/profile";
import { amountFields, type AmountKey } from "@src/pages/configuration/raceIngredients/constants";
import { useRaceDraft } from "../../context/raceDraftContext";
import {
  altitudePoints,
  chartSpans,
  resolveLandmarks,
  type ChartLandmark,
  type ChartPoint,
  type ChartSpan,
} from "../chart/chartData";

// Una toma de la carrera, con lo que muestra su tarjeta
export type PosterIntake = {
  km: number;
  amount: number;
  name: string;
  imageUrl: string | null;
};

// Totales de la carrera: g de HC, mg de sodio y cafeína y ml de líquido (ver amountFields)
type PosterTotals = Record<AmountKey, number> & { kcal: number };

export type RacePosterData = {
  // Idioma del corredor (all_users.prefered_language): el de textos, fechas y números
  language: SupportedLanguage;
  name: string;
  date: string;
  distanceKm: number | null;
  elevationGain: number | null;
  totals: PosterTotals;
  intakes: PosterIntake[];
  // Puntos de altitud del perfil (vacío mientras la carrera no tenga altitudes)
  profile: ChartPoint[];
  landmarks: ChartLandmark[];
  spans: ChartSpan[];
};

/** Σ unidades × cantidad por unidad de cada toma. Los ingredientes borrados siguen contando. */
const raceTotals = (
  intakes: RacePlanDraft["ingredients"],
  catalog: Map<number, RaceIngredient>,
): PosterTotals => {
  const sumOf = (key: AmountKey) =>
    raceHc(intakes, (intake) => catalog.get(intake.ingredient_id)?.[key]);

  const totals = Object.fromEntries(amountFields.map(({ key }) => [key, sumOf(key)])) as Record<
    AmountKey,
    number
  >;
  return { ...totals, kcal: hcToKcal(totals.hc_amount) };
};

const totalElevationGain = (steps: RacePlanDraft["steps"]) => {
  const gains = steps.flatMap((step) => (step.elevation_gain === null ? [] : [step.elevation_gain]));
  return gains.length ? gains.reduce((sum, gain) => sum + gain, 0) : null;
};

/**
 * Todo lo que pinta la imagen de la carrera, a partir del borrador, en el idioma del corredor.
 * `isReady` es false mientras se carga ese idioma (y los nombres de los puntos de interés en
 * él) o el catálogo de ingredientes: hasta entonces la imagen saldría incompleta o en otro
 * idioma y no debe subirse ni descargarse.
 */
export const useRacePosterData = (): { data: RacePosterData; isReady: boolean } => {
  const { draft } = useRaceDraft();
  // Sin el catálogo saldrían "#id", totales a 0 y sin imágenes: isReady lo espera
  const { byId: catalog, isLoading: catalogLoading } = useRaceIngredientCatalog();
  const runner = useFetchSingleUser({ userId: draft.userId });
  // Si no se puede leer, el de la base de datos por defecto
  const language = toSupportedLanguage(runner.data?.prefered_language ?? "es");
  const landmarkOptions = useFetchRaceLandmarkOptions(language);

  const data = useMemo((): RacePosterData => {
    const intakes = draft.ingredients
      .map((intake) => {
        const ingredient = catalog.get(intake.ingredient_id);
        return {
          km: intake.km,
          amount: intake.amount,
          name: ingredient?.name ?? `#${intake.ingredient_id}`,
          imageUrl: ingredient?.image_url ?? null,
        };
      })
      .sort((a, b) => a.km - b.km);

    return {
      language,
      name: draft.name.trim(),
      date: draft.raceDate,
      distanceKm: draft.distanceKm,
      elevationGain: totalElevationGain(draft.steps),
      totals: raceTotals(draft.ingredients, catalog),
      intakes,
      profile: altitudePoints(draft.steps),
      landmarks: resolveLandmarks(draft.landmarks, landmarkOptions.data),
      spans: chartSpans(draft.ingredients),
    };
  }, [draft, catalog, language, landmarkOptions.data]);

  return {
    data,
    isReady: !catalogLoading && !runner.isLoading && !landmarkOptions.isLoading,
  };
};
