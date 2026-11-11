/**
 * Agrupa las muestras de un perfil (km, altitud y hora de paso) en los tramos de race_steps.
 * Lo usan el gpx y la imagen del perfil: cada uno saca sus muestras y aquí se forman los tramos.
 */
import type { RaceStepDraft } from "@src/services/tanstack/user/races";

// Muestra del perfil: altitud (si se conoce) y hora de paso en un km del recorrido
export type ProfileSample = { km: number; altitude: number | null; time: number | null };

// nutri_races.distance_km es numeric(7, 3); menos de 100 m no es una carrera
export const MIN_DISTANCE_KM = 0.1;
export const MAX_DISTANCE_KM = 9999;
// Un último tramo más corto que esto se une al anterior
const MIN_LAST_STEP_KM = 0.1;

export const round = (value: number, decimals: number) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

/** Tramos de 1 km hasta 50 km, de 3 km hasta 200 km y de 5 km a partir de ahí. */
const stepLengthKm = (distanceKm: number) => {
  if (distanceKm <= 50) return 1;
  if (distanceKm <= 200) return 3;
  return 5;
};

/** Km donde empieza cada tramo. */
const stepStarts = (distanceKm: number) => {
  const length = stepLengthKm(distanceKm);
  const starts: number[] = [];
  for (let km = 0; km < distanceKm; km += length) starts.push(km);

  const lastStepKm = distanceKm - starts[starts.length - 1];
  if (starts.length > 1 && lastStepKm < MIN_LAST_STEP_KM) starts.pop();
  return starts;
};

const interpolate = (a: number | null, b: number | null, ratio: number) =>
  a === null || b === null ? null : a + (b - a) * ratio;

/**
 * Añade una muestra interpolada en cada inicio de tramo: así cada tramo tiene altitud en sus
 * dos extremos aunque el perfil tenga pocos puntos.
 */
const withStepBoundaries = (samples: ProfileSample[], starts: number[]) => {
  const result = [...samples];
  for (const km of starts) {
    const nextIndex = samples.findIndex((sample) => sample.km >= km);
    if (nextIndex <= 0 || samples[nextIndex].km === km) continue;

    const prev = samples[nextIndex - 1];
    const next = samples[nextIndex];
    const ratio = (km - prev.km) / (next.km - prev.km);
    result.push({
      km,
      altitude: interpolate(prev.altitude, next.altitude, ratio),
      time: interpolate(prev.time, next.time, ratio),
    });
  }
  return result.sort((a, b) => a.km - b.km);
};

/** Tiempo desde la salida en hh:mm:ss. */
const formatElapsed = (ms: number) => {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
};

/** Altitud mínima y máxima, desnivel y hora de paso de un tramo a partir de sus muestras. */
const summarizeStep = (
  kmStart: number,
  samples: ProfileSample[],
  startTime: number | null,
): RaceStepDraft => {
  const withAltitude = samples.filter((sample) => sample.altitude !== null);
  const lowest = withAltitude.reduce<ProfileSample | null>(
    (min, sample) => (min === null || sample.altitude! < min.altitude! ? sample : min),
    null,
  );
  const highest = withAltitude.reduce<ProfileSample | null>(
    (max, sample) => (max === null || sample.altitude! > max.altitude! ? sample : max),
    null,
  );

  let gain = 0;
  let loss = 0;
  for (let i = 1; i < withAltitude.length; i++) {
    const diff = withAltitude[i].altitude! - withAltitude[i - 1].altitude!;
    if (diff > 0) gain += diff;
    else loss -= diff;
  }

  const hasAltitude = withAltitude.length > 0;
  const firstTime = samples[0]?.time ?? null;

  return {
    km_start: round(kmStart, 3),
    min_altitude: lowest ? round(lowest.altitude!, 1) : null,
    min_altitude_at: lowest ? round(lowest.km, 3) : null,
    max_altitude: highest ? round(highest.altitude!, 1) : null,
    max_altitude_at: highest ? round(highest.km, 3) : null,
    elevation_gain: hasAltitude ? round(gain, 1) : null,
    elevation_loss: hasAltitude ? round(loss, 1) : null,
    aprox_time_start:
      startTime !== null && firstTime !== null ? formatElapsed(firstTime - startTime) : null,
  };
};

/** Tramos de la carrera a partir de las muestras del perfil, ordenadas por km. */
export const buildRaceSteps = (samples: ProfileSample[], distanceKm: number) => {
  const starts = stepStarts(distanceKm);
  const withBoundaries = withStepBoundaries(samples, starts);
  const startTime = withBoundaries[0].time;

  return starts.map((kmStart, i) => {
    const kmEnd = starts[i + 1] ?? Infinity;
    const stepSamples = withBoundaries.filter(
      (sample) => sample.km >= kmStart && sample.km <= kmEnd,
    );
    return summarizeStep(kmStart, stepSamples, startTime);
  });
};
