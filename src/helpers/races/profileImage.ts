/**
 * Convierte el perfil leído de una imagen (edge function race-profile-image) en el perfil de
 * la carrera: nombre, distancia y tramos, igual que se hace con un gpx.
 */
import type { RaceStepDraft } from "@src/services/tanstack/user/races";
import { fileNameWithoutExtension } from "@src/helpers/files";
import { buildRaceSteps, MAX_DISTANCE_KM, MIN_DISTANCE_KM, round } from "./profile";

// Respuesta de race-profile-image
export type ImageProfile = {
  name: string | null;
  distance_km: number | null;
  elevation_gain: number | null;
  points: { km: number; altitude: number }[];
};

// Clave de traducción en data:races.profile.imageErrors
type ProfileImageErrorKey = "invalidFile" | "tooLarge" | "noProfile" | "tooShort" | "tooLong";

export class ProfileImageError extends Error {
  readonly key: ProfileImageErrorKey;

  constructor(key: ProfileImageErrorKey) {
    super(`Invalid profile image: ${key}`);
    this.key = key;
  }
}

type ImageRacePlan = {
  name: string;
  distanceKm: number;
  steps: RaceStepDraft[];
};

// Formatos que acepta Gemini; el límite deja margen al base64 dentro del de la función
export const PROFILE_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const checkProfileImage = (file: File) => {
  if (!PROFILE_IMAGE_TYPES.includes(file.type)) throw new ProfileImageError("invalidFile");
  if (file.size > MAX_IMAGE_BYTES) throw new ProfileImageError("tooLarge");
};

/** Puntos ordenados por km y sin km repetidos (el modelo a veces repite el de un pico). */
const sortedPoints = (points: ImageProfile["points"]) => {
  const byKm = new Map<number, number>();
  for (const point of points) byKm.set(round(point.km, 3), point.altitude);
  return [...byKm.entries()]
    .sort(([a], [b]) => a - b)
    .map(([km, altitude]) => ({ km, altitude, time: null }));
};

/**
 * Leer la línea de una gráfica no da el desnivel exacto: el trazo suaviza los repechos o
 * mete dientes que no existen. Si la imagen dice el desnivel total, se reparte entre los
 * tramos en proporción al que se ha leído en cada uno.
 */
const fitElevationGain = (steps: RaceStepDraft[], totalGain: number | null) => {
  const readGain = steps.reduce((sum, step) => sum + (step.elevation_gain ?? 0), 0);
  if (totalGain === null || readGain <= 0) return steps;

  const factor = totalGain / readGain;
  return steps.map((step) => ({
    ...step,
    elevation_gain: step.elevation_gain === null ? null : round(step.elevation_gain * factor, 1),
    elevation_loss: step.elevation_loss === null ? null : round(step.elevation_loss * factor, 1),
  }));
};

/** Nombre, distancia y tramos de un perfil leído de una imagen. */
export const raceProfileFromImage = (profile: ImageProfile, fileName: string): ImageRacePlan => {
  const points = sortedPoints(profile.points);
  if (points.length < 2) throw new ProfileImageError("noProfile");

  // La distancia escrita en la imagen es más fiable que el último punto que se ha leído
  const distanceKm = round(profile.distance_km ?? points[points.length - 1].km, 3);
  if (distanceKm < MIN_DISTANCE_KM) throw new ProfileImageError("tooShort");
  if (distanceKm > MAX_DISTANCE_KM) throw new ProfileImageError("tooLong");

  const samples = points.filter((point) => point.km <= distanceKm);
  if (samples.length < 2) throw new ProfileImageError("noProfile");

  const steps = buildRaceSteps(samples, distanceKm);

  return {
    name: profile.name || fileNameWithoutExtension(fileName) || "Carrera",
    distanceKm,
    steps: fitElevationGain(steps, profile.elevation_gain),
  };
};
