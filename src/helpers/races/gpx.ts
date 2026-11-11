/**
 * Convierte un gpx en el perfil de una carrera (nombre, distancia y tramos) en el navegador.
 * La lectura del xml la hace @we-gold/gpxjs y los tramos se forman en profile.ts.
 */
import { calculateDistance, parseGPX, type Point } from "@we-gold/gpxjs";
import type { RaceStepDraft } from "@src/services/tanstack/user/races";
import { buildRaceSteps, MAX_DISTANCE_KM, MIN_DISTANCE_KM, round } from "./profile";

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
  const steps = buildRaceSteps(
    points.map((point, i) => ({
      km: cumulative[i] / 1000,
      altitude: point.elevation,
      time: withTimes ? point.time!.getTime() : null,
    })),
    distanceKm,
  );

  return {
    name: cleanName(name ?? "") || fileBaseName(fileName) || "Carrera",
    distanceKm,
    steps,
  };
};
