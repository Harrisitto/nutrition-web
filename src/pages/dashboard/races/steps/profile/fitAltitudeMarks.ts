import type { RaceStepDraft } from "@src/services/tanstack/user/races";
import { roundKm } from "../../validation";

/**
 * Quita el km del mínimo y del máximo de altitud (min/max_altitude_at) de los
 * tramos en los que ha quedado fuera del tramo, al mover un km_start, añadir un
 * tramo o cambiar la distancia. La tabla no los muestra, así que el usuario no
 * podría corregirlos y save_race_plan rechazaría la carrera; sin ellos la
 * gráfica sitúa la altitud al inicio del tramo.
 */
export const fitAltitudeMarks = (
  steps: RaceStepDraft[],
  distanceKm: number | null,
): RaceStepDraft[] => {
  const kmStarts = steps.map((step) => roundKm(step.km_start));

  return steps.map((step) => {
    const kmStart = roundKm(step.km_start);
    const nextStarts = kmStarts.filter((km) => km > kmStart);
    const kmEnd = nextStarts.length
      ? Math.min(...nextStarts)
      : distanceKm !== null
        ? roundKm(distanceKm)
        : null;
    const fit = (at: number | null) =>
      at !== null && roundKm(at) >= kmStart && (kmEnd === null || roundKm(at) <= kmEnd)
        ? at
        : null;

    const minAt = fit(step.min_altitude_at);
    const maxAt = fit(step.max_altitude_at);
    return minAt === step.min_altitude_at && maxAt === step.max_altitude_at
      ? step
      : { ...step, min_altitude_at: minAt, max_altitude_at: maxAt };
  });
};
