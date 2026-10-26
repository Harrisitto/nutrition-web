import { useMemo } from "react";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StorageApiError } from "@supabase/supabase-js";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import FromDate from "@src/helpers/dates";
import { hcToKcal, kcalByDate, raceHc } from "@src/helpers/nutrition";
import { downloadBlob } from "@src/helpers/images";
import { useAppSelector } from "@src/store/store";
import type { Database } from "@src/services/supabase/types";
import { useGetAuthSession } from "../auth/get";

const GPX_BUCKET = "race_gpx";
const RACE_IMAGES_BUCKET = "race_images";

// PNG del grafico de la carrera que descarga el corredor: race_images/{nutri_id}/{race_id}.png,
// en la carpeta del nutricionista dueño de la carrera (lo exigen las policies del bucket)
const raceImagePath = (nutriId: string, raceId: number) => `${nutriId}/${raceId}.png`;

const selectRacesWithHc = () => {
  return `
    id,
    nutri_id,
    name,
    race_date,
    distance_km,
    gpx_path,
    race_ingredients(
      amount,
      ingredient: nutri_race_ingredients(hc_amount)
    )
  ` as const;
};

// Carreras entre dos fechas (ambas incluidas) con los hidratos planeados
// (amount × hc_amount de cada toma) y sus kcal
const racesForDateRangeOptions = ({
  userId,
  start,
  end,
}: {
  userId: string | null;
  start: string;
  end: string;
}) =>
  queryOptions({
    queryKey: queryKeys({ userId }).user.races(start, end),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nutri_races")
        .select(selectRacesWithHc())
        .eq("user_id", userId || "")
        .gte("race_date", start)
        .lte("race_date", end)
        .order("race_date");

      if (error) {
        throw error;
      }

      return data.map((race) => {
        const totalHc = raceHc(
          race.race_ingredients,
          (intake) => intake.ingredient?.hc_amount,
        );

        return {
          id: race.id,
          nutriId: race.nutri_id,
          name: race.name,
          date: race.race_date,
          distanceKm: race.distance_km,
          gpxPath: race.gpx_path,
          totalHc,
          totalKcal: hcToKcal(totalHc),
        };
      });
    },
    enabled: !!userId,
  });

/**
 * Carreras del cliente seleccionado en la semana de `selectedDay`.
 */
export const useFetchRacesForWeek = () => {
  const savedDate = useAppSelector((state) => state.config.selectedDay);
  const selectedDate = new FromDate(savedDate);

  return useFetchRacesForDateRange({
    startDate: selectedDate.thisMonday(),
    endDate: selectedDate.thisSunday(),
  });
};

export const useFetchRacesForDateRange = ({
  startDate,
  endDate,
}: {
  startDate: FromDate;
  endDate: FromDate;
}) => {
  const user = useAppSelector((state) => state.config.selectedUserId);
  return useQuery(
    racesForDateRangeOptions({ userId: user, start: startDate.save(), end: endDate.save() }),
  );
};

// Kcal ingeridas en las carreras, por fecha ("YYYY-MM-DD")
export const useFetchRacesKcalForDateRange = ({
  startDate,
  endDate,
}: {
  startDate: FromDate;
  endDate: FromDate;
}) => {
  const user = useAppSelector((state) => state.config.selectedUserId);
  return useQuery({
    ...racesForDateRangeOptions({ userId: user, start: startDate.save(), end: endDate.save() }),
    select: (races) => kcalByDate(races, (race) => race.totalKcal),
  });
};

/**
 * HC y kcal de carrera por fecha en la semana de `selectedDay` (puede haber
 * más de una carrera el mismo día).
 */
export const useRaceTotalsByDate = () => {
  const racesQuery = useFetchRacesForWeek();

  const totalsByDate = useMemo(() => {
    const totals = new Map<string, { hc: number; kcal: number }>();
    racesQuery.data?.forEach((race) => {
      const saved = totals.get(race.date) ?? { hc: 0, kcal: 0 };
      totals.set(race.date, {
        hc: saved.hc + race.totalHc,
        kcal: saved.kcal + race.totalKcal,
      });
    });
    return totals;
  }, [racesQuery.data]);

  return { totalsByDate, isLoading: racesQuery.isLoading };
};

type Tables = Database["public"]["Tables"];

// Tramo, toma y punto de interés tal y como se editan en el borrador y se envían a save_race_plan
export type RaceStepDraft = Omit<Tables["race_steps"]["Row"], "race_id">;
export type RaceIngredientDraft = Pick<
  Tables["race_ingredients"]["Row"],
  "ingredient_id" | "km" | "amount" | "km_span"
>;
export type RaceLandmarkDraft = Pick<
  Tables["race_landmarks"]["Row"],
  "landmark_id" | "km" | "name"
>;

// Plan completo de una carrera: lo que se edita en la página races y se envía a save_race_plan
export type RacePlanDraft = {
  id: number | null;
  // Corredor de la carrera: no cambia aunque se seleccione otro cliente
  userId: string;
  name: string;
  raceDate: string;
  distanceKm: number | null;
  gpxPath: string | null;
  steps: RaceStepDraft[];
  // Van por km exacto, no por tramo: no se pierden al regenerar el perfil
  ingredients: RaceIngredientDraft[];
  landmarks: RaceLandmarkDraft[];
};

const selectRacePlan = () => {
  return `
    id,
    user_id,
    name,
    race_date,
    distance_km,
    gpx_path,
    race_steps(
      km_start,
      min_altitude,
      min_altitude_at,
      max_altitude,
      max_altitude_at,
      elevation_gain,
      elevation_loss,
      aprox_time_start
    ),
    race_ingredients(ingredient_id, km, amount, km_span),
    race_landmarks(landmark_id, km, name)
  ` as const;
};

/**
 * Plan completo de una carrera para editarlo en la página races.
 */
export const useFetchRacePlan = (raceId: number | null) => {
  const user = useAppSelector((state) => state.config.selectedUserId);

  return useQuery({
    queryKey: queryKeys({ userId: user }).user.racePlan(raceId ?? 0),
    queryFn: async (): Promise<RacePlanDraft> => {
      const { data, error } = await supabase
        .from("nutri_races")
        .select(selectRacePlan())
        .eq("id", raceId ?? 0)
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        raceDate: data.race_date,
        distanceKm: data.distance_km,
        gpxPath: data.gpx_path,
        steps: data.race_steps.sort((a, b) => a.km_start - b.km_start),
        ingredients: data.race_ingredients.sort((a, b) => a.km - b.km),
        landmarks: data.race_landmarks,
      };
    },
    enabled: raceId !== null,
    // El borrador copia estos datos al abrir la carrera: cada apertura parte de la base de datos
    staleTime: 0,
    gcTime: 0,
  });
};

/**
 * Borra de race_gpx los gpx que ya no usa ninguna carrera (un gpx puede estar
 * compartido, p. ej. por carreras copiadas a otros corredores). Si falla solo
 * queda un fichero huérfano: el error no se propaga.
 */
export const removeUnusedGpx = async (paths: string[]) => {
  const candidates = [...new Set(paths)];
  if (!candidates.length) return;

  const { data, error } = await supabase
    .from("nutri_races")
    .select("gpx_path")
    .in("gpx_path", candidates);

  if (error) {
    console.error("Error checking race gpx usage:", error);
    return;
  }

  const used = new Set(data.map((race) => race.gpx_path));
  const unused = candidates.filter((path) => !used.has(path));
  if (!unused.length) return;

  const { error: storageError } = await supabase.storage
    .from(GPX_BUCKET)
    .remove(unused);
  if (storageError) {
    console.error("Error removing race gpx:", storageError);
  }
};

/**
 * Sube el gpx de la carrera a race_gpx/<nutri_id>/ y devuelve su ruta. El gpx se procesa
 * antes, en el navegador (helpers/races/gpx.ts): aquí solo se guarda el fichero original.
 */
export const useUploadGpx = () => {
  const { data: sessionData } = useGetAuthSession();
  const nutriId = sessionData?.userId ?? "";

  return useMutation({
    mutationFn: async (file: File) => {
      // Prefijo de tiempo para no pisar otro gpx con el mismo nombre
      const safeName = file.name.replace(/[^\w.-]+/g, "_");
      const gpxPath = `${nutriId}/${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from(GPX_BUCKET)
        .upload(gpxPath, file, {
          contentType: file.type || "application/gpx+xml",
        });

      if (error) {
        throw error;
      }
      return gpxPath;
    },
  });
};

/**
 * Sube (sobrescribe) el png de la carrera a race_images/{nutri_id}/{race_id}.png, de donde lo
 * descarga el corredor. Solo puede subirlo el dueño de la carrera, en su carpeta.
 */
const uploadRaceImage = async (nutriId: string, raceId: number, image: Blob) => {
  const { error } = await supabase.storage
    .from(RACE_IMAGES_BUCKET)
    .upload(raceImagePath(nutriId, raceId), image, {
      contentType: "image/png",
      upsert: true,
      // Se sobrescribe en cada guardado: que el corredor no vea una versión cacheada
      cacheControl: "0",
    });

  if (error) {
    throw error;
  }
};

/**
 * Guarda la carrera con save_race_plan y sube su imagen, que `renderImage` genera a partir
 * del borrador. Devuelve el id de la carrera y si se ha subido la imagen.
 */
export const useSaveRacePlan = () => {
  const queryClient = useQueryClient();
  // Quien guarda es el dueño de la carrera: la imagen va a su carpeta
  const { data: sessionData } = useGetAuthSession();
  const nutriId = sessionData?.userId ?? "";

  return useMutation({
    mutationFn: async ({
      draft,
      renderImage,
    }: {
      draft: RacePlanDraft;
      renderImage: () => Promise<Blob>;
    }) => {
      if (draft.distanceKm === null) throw new Error("Race distance is required");

      // La imagen no depende de la carrera guardada: se genera mientras se guarda. Si falla,
      // null (se avisa con imageUploaded)
      const image = renderImage().catch((renderError: unknown) => {
        console.error("Error rendering race image:", renderError);
        return null;
      });

      const { data: raceId, error } = await supabase.rpc("save_race_plan", {
        p_id: draft.id ?? undefined,
        p_user_id: draft.userId,
        p_race_date: draft.raceDate,
        p_name: draft.name,
        p_distance_km: draft.distanceKm,
        p_gpx_path: draft.gpxPath ?? undefined,
        p_steps: draft.steps,
        p_ingredients: draft.ingredients,
        p_landmarks: draft.landmarks,
      });

      if (error) {
        throw error;
      }

      // La carrera ya está guardada: si la imagen falla no se propaga (reintentar el guardado
      // de una carrera nueva la duplicaría), pero se avisa. Se vuelve a subir al guardar de nuevo.
      const png = await image;
      if (!png) return { raceId, imageUploaded: false };
      try {
        await uploadRaceImage(nutriId, raceId, png);
        return { raceId, imageUploaded: true };
      } catch (imageError) {
        console.error("Error uploading race image:", imageError);
        return { raceId, imageUploaded: false };
      }
    },
    onSuccess: (_saved, { draft }) => {
      // Recalcula la fila de carreras y el balance energético de la tabla
      queryClient.invalidateQueries({
        queryKey: queryKeys({ userId: draft.userId }).user.racesBase,
      });
    },
  });
};

/** Nombre del png al descargarlo: fecha y nombre de la carrera. */
export const raceImageFileName = (race: { name: string; date: string }) =>
  `${race.date}-${race.name.replace(/[^\p{L}\p{N}._-]+/gu, "_")}.png`;

/**
 * La carrera no tiene imagen en race_images: se guardó antes de que existiera o falló la
 * subida. Storage suele responder 400 con statusCode "404" (Object not found), pero según el
 * backend puede llegar como HTTP 404 o con otro código.
 */
export const isMissingRaceImage = (error: unknown) =>
  error instanceof StorageApiError &&
  (error.status === 404 || ["404", "not_found", "NoSuchKey"].includes(error.statusCode));

/**
 * Descarga la imagen (png) de una carrera tal y como se subió al guardarla: la misma que ve
 * el corredor. Si no la tiene, falla con un error que reconoce isMissingRaceImage.
 */
export const useDownloadRaceImage = () => {
  return useMutation({
    mutationFn: async (race: { id: number; nutriId: string; name: string; date: string }) => {
      const { data, error } = await supabase.storage
        .from(RACE_IMAGES_BUCKET)
        .download(raceImagePath(race.nutriId, race.id));

      if (error) {
        throw error;
      }
      downloadBlob(data, raceImageFileName(race));
    },
  });
};

/**
 * Borra una carrera (tramos, ingredientes y landmarks caen en cascada), su imagen y su gpx.
 */
export const useDeleteRace = () => {
  const user = useAppSelector((state) => state.config.selectedUserId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      nutriId,
      gpxPath,
    }: {
      id: number;
      nutriId: string;
      gpxPath: string | null;
    }) => {
      const { error } = await supabase.from("nutri_races").delete().eq("id", id);

      if (error) {
        throw error;
      }

      // Después de la carrera, para no quedarse sin imagen si su borrado falla: la policy de
      // borrado de race_images solo mira la carpeta (la del dueño), así que sigue valiendo. Si
      // falla solo queda un fichero huérfano: el error no se propaga
      const removeImage = async () => {
        const { error: imageError } = await supabase.storage
          .from(RACE_IMAGES_BUCKET)
          .remove([raceImagePath(nutriId, id)]);
        if (imageError) {
          console.error("Error removing race image:", imageError);
        }
      };

      await Promise.all([removeImage(), gpxPath ? removeUnusedGpx([gpxPath]) : undefined]);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys({ userId: user }).user.racesBase,
      });
    },
  });
};
