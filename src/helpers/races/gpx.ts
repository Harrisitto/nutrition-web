/**
 * Convierte un gpx en el perfil de una carrera (nombre, distancia y tramos) en el navegador.
 * La lectura del xml la hace @we-gold/gpxjs; aquí solo se agrupan los puntos en tramos.
 */
import { calculateDistance, parseGPX, type Point } from "@we-gold/gpxjs";
import type { RaceStepDraft } from "@src/services/tanstack/user/races";

// Clave de traducción en data:races.profile.gpxErrors
type GpxErrorKey = "invalidFile" | "noPoints" | "tooShort" | "tooLong";

export class GpxError extends Error {
  readonly key: GpxErrorKey;

  constructor(key: GpxErrorKey) {
    super(`Invalid gpx: ${key}`);
    this.key = key;
  }
}

type GpxRacePlan = {
  name: string;
  distanceKm: number;
  steps: RaceStepDraft[];
};

// nutri_races.distance_km es numeric(7, 3); menos de 100 m no es una carrera
const MIN_DISTANCE_KM = 0.1;
const MAX_DISTANCE_KM = 9999;
// Un último tramo más corto que esto se une al anterior
const MIN_LAST_STEP_KM = 0.1;

// Muestra del perfil: altitud (si se conoce) y hora de paso en un km del recorrido
type ProfileSample = { km: number; altitude: number | null; time: number | null };

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

const round = (value: number, decimals: number) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const interpolate = (a: number | null, b: number | null, ratio: number) =>
  a === null || b === null ? null : a + (b - a) * ratio;

/**
 * Añade una muestra interpolada en cada inicio de tramo: así cada tramo tiene altitud en sus
 * dos extremos aunque el gpx tenga pocos puntos.
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

/** Las horas solo valen si todos los puntos tienen una y avanzan: si no, es una ruta planificada. */
const hasRealTimes = (points: Point[]) =>
  points.every((point, i) => point.time !== null && (i === 0 || point.time >= points[i - 1].time!)) &&
  points[points.length - 1].time!.getTime() > points[0].time!.getTime();

/** Puntos del recorrido: los de los tracks o, si no hay, los de las rutas. */
const coursePoints = (xml: string) => {
  // Sin removeEmptyFields los datos que faltan (p. ej. la altitud) llegan como null, no se
  // borran. avgSpeedThreshold solo afecta a las duraciones del paquete, que no se usan
  const [gpx, error] = parseGPX(xml, { removeEmptyFields: false, avgSpeedThreshold: 0 });
  // DOMParser no lanza con un xml roto: devuelve un documento con <parsererror>
  const isGpx =
    gpx?.xml.documentElement.nodeName === "gpx" &&
    gpx.xml.getElementsByTagName("parsererror").length === 0;
  if (error || !isGpx) throw new GpxError("invalidFile");

  const trackPoints = gpx.tracks.flatMap((track) => track.points);
  const points = trackPoints.length ? trackPoints : gpx.routes.flatMap((route) => route.points);
  const name = gpx.metadata.name ?? gpx.tracks[0]?.name ?? gpx.routes[0]?.name ?? null;
  return { name, points };
};

const fileBaseName = (fileName: string) => fileName.replace(/\.[^.]*$/, "");

// Algunas apps meten su nombre en el del track ("Wikiloc - Ruta") o el del fichero ("ruta.gpx")
const APP_NAME_RE = /^(wikiloc|strava|komoot|garmin connect)\s*-\s*|\s*-\s*(wikiloc|strava|komoot)$/i;
const cleanName = (name: string) => name.replace(APP_NAME_RE, "").replace(/\.gpx$/i, "").trim();

/** Nombre, distancia y tramos de un gpx. Lanza GpxError si el gpx no sirve. */
export const parseRaceGpx = (xml: string, fileName: string): GpxRacePlan => {
  const { name, points } = coursePoints(xml);
  if (points.length < 2) throw new GpxError("noPoints");

  const { cumulative } = calculateDistance(points); // en metros
  const distanceKm = round(cumulative[cumulative.length - 1] / 1000, 3);
  if (distanceKm < MIN_DISTANCE_KM) throw new GpxError("tooShort");
  if (distanceKm > MAX_DISTANCE_KM) throw new GpxError("tooLong");

  const withTimes = hasRealTimes(points);
  const starts = stepStarts(distanceKm);
  const samples = withStepBoundaries(
    points.map((point, i) => ({
      km: cumulative[i] / 1000,
      altitude: point.elevation,
      time: withTimes ? point.time!.getTime() : null,
    })),
    starts,
  );
  const startTime = samples[0].time;

  const steps = starts.map((kmStart, i) => {
    const kmEnd = starts[i + 1] ?? Infinity;
    const stepSamples = samples.filter((sample) => sample.km >= kmStart && sample.km <= kmEnd);
    return summarizeStep(kmStart, stepSamples, startTime);
  });

  return {
    name: cleanName(name ?? "") || fileBaseName(fileName) || "Carrera",
    distanceKm,
    steps,
  };
};
