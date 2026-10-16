import type { RaceIngredient } from "@src/services/tanstack/data/raceIngredients";
import type {
  RaceIngredientDraft,
  RaceLandmarkDraft,
  RaceStepDraft,
} from "@src/services/tanstack/user/races";
import { INGREDIENT_GAP, LANDMARK_LABEL_GAP, MAX_LANES } from "./constants";

// Punto de interés listo para pintar: nombre ya resuelto (el escrito o el del tipo) e icono
export type ChartLandmark = { km: number; name: string; iconUrl?: string };

// Toma que dura varios km (p. ej. un bidón): se pinta como una franja de km a km + kmSpan
export type ChartSpan = { km: number; kmSpan: number };

export type ChartPoint = {
  km: number;
  altitude: number;
  ingredients?: string[];
  // Imagen de cada toma del km (null si el ingrediente no tiene)
  images?: (string | null)[];
  // Carril de las imágenes, para no solapar las de un km cercano
  lane?: number;
};

// Puntos de altitud conocidos: el mínimo y el máximo de cada tramo, en su km
export const altitudePoints = (steps: RaceStepDraft[]): ChartPoint[] => {
  const byKm = new Map<number, number>();
  steps.forEach((step) => {
    if (step.min_altitude !== null) {
      byKm.set(step.min_altitude_at ?? step.km_start, step.min_altitude);
    }
    if (step.max_altitude !== null) {
      byKm.set(step.max_altitude_at ?? step.km_start, step.max_altitude);
    }
  });
  return Array.from(byKm, ([km, altitude]) => ({ km, altitude })).sort(
    (a, b) => a.km - b.km,
  );
};

// Altitud en un km cualquiera, interpolando entre los puntos conocidos (ordenados y sin km repetidos)
export const altitudeAt = (points: ChartPoint[], km: number) => {
  if (!points.length) return 0;
  const nextIndex = points.findIndex((point) => point.km >= km);
  if (nextIndex === -1) return points[points.length - 1].altitude;
  if (nextIndex === 0) return points[0].altitude;
  const prev = points[nextIndex - 1];
  const next = points[nextIndex];
  const ratio = (km - prev.km) / (next.km - prev.km);
  return prev.altitude + (next.altitude - prev.altitude) * ratio;
};

/**
 * Carril de cada km (ordenados) para que lo que se dibuja en ellos no se
 * solape: cada uno va al primer carril cuyo último km está al menos a minGap;
 * si no hay ninguno, a un carril nuevo o, si ya hay maxLanes, al más lejano.
 */
export const assignLanes = (kms: number[], minGap: number, maxLanes: number) => {
  const lastKmByLane: number[] = [];
  return kms.map((km) => {
    let lane = lastKmByLane.findIndex((lastKm) => km - lastKm >= minGap);
    if (lane === -1) {
      lane =
        lastKmByLane.length < maxLanes
          ? lastKmByLane.length
          : lastKmByLane.indexOf(Math.min(...lastKmByLane));
    }
    lastKmByLane[lane] = km;
    return lane;
  });
};

/**
 * Perfil de altitud con un punto por km con tomas sobre él (puede haber
 * varias en el mismo km). Sin altitudes no hay perfil: devuelve null.
 */
export const buildChartData = ({
  steps,
  ingredients,
  distanceKm,
  catalog,
}: {
  steps: RaceStepDraft[];
  ingredients: RaceIngredientDraft[];
  distanceKm: number | null;
  catalog: Map<number, RaceIngredient>;
}) => {
  const points = altitudePoints(steps);
  if (!points.length) return null;

  const intakesByKm = new Map<number, { ingredients: string[]; images: (string | null)[] }>();
  ingredients.forEach((intake) => {
    const ingredient = catalog.get(intake.ingredient_id);
    const entry = intakesByKm.get(intake.km) ?? { ingredients: [], images: [] };
    entry.ingredients.push(
      `${intake.amount}× ${ingredient?.name ?? `#${intake.ingredient_id}`}`,
    );
    entry.images.push(ingredient?.image_url ?? null);
    intakesByKm.set(intake.km, entry);
  });

  const intakeKms = [...intakesByKm.keys()].sort((a, b) => a - b);
  const maxKm = Math.max(
    distanceKm ?? 0,
    points[points.length - 1].km,
    intakeKms[intakeKms.length - 1] ?? 0,
  );
  const lanes = assignLanes(intakeKms, maxKm * INGREDIENT_GAP, MAX_LANES);
  const ingredientPoints = intakeKms.map((km, index) => ({
    km,
    altitude: altitudeAt(points, km),
    lane: lanes[index],
    ...intakesByKm.get(km),
  }));

  return {
    data: [...points, ...ingredientPoints].sort((a, b) => a.km - b.km),
    maxKm,
  };
};

export type ChartData = NonNullable<ReturnType<typeof buildChartData>>;

// Tipo de punto de interés del catálogo, con el nombre ya en el idioma pedido
type LandmarkOption = { id: number; name: string | null; url: string | null };

/** Puntos de interés del borrador con su nombre (el escrito o el del tipo) e icono. */
export const resolveLandmarks = (
  landmarks: RaceLandmarkDraft[],
  options: LandmarkOption[] | undefined,
): ChartLandmark[] => {
  const optionsById = new Map(options?.map((option) => [option.id, option]));
  return landmarks.map((landmark) => {
    const option = optionsById.get(landmark.landmark_id);
    return {
      km: landmark.km,
      name: landmark.name || option?.name || "",
      iconUrl: option?.url ?? undefined,
    };
  });
};

// Tomas con "durante" del borrador
export const chartSpans = (ingredients: RaceIngredientDraft[]): ChartSpan[] =>
  ingredients.flatMap((intake) =>
    intake.km_span ? [{ km: intake.km, kmSpan: intake.km_span }] : [],
  );

// Carril de la etiqueta de cada punto de interés, por su índice en la lista
export const landmarkLanes = (landmarks: { km: number }[], maxKm: number) => {
  const sorted = landmarks
    .map((landmark, index) => ({ km: landmark.km, index }))
    .sort((a, b) => a.km - b.km);
  const lanes = assignLanes(
    sorted.map(({ km }) => km),
    maxKm * LANDMARK_LABEL_GAP,
    MAX_LANES,
  );

  const byIndex: number[] = [];
  sorted.forEach(({ index }, position) => {
    byIndex[index] = lanes[position];
  });
  return byIndex;
};
