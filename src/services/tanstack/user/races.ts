import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import FromDate from "@src/helpers/dates";
import { hcToKcal, raceHc } from "@src/helpers/nutrition";
import { useAppSelector } from "@src/store/store";
import { useLanguageCode } from "@src/hooks/helpers/language";
import type { Database } from "@src/services/supabase/types";
import { useGetAuthSession } from "../auth/get";

const GPX_BUCKET = "race_gpx";

const selectRacesWithHc = () => {
  return `
    id,
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

/**
 * Carreras del cliente seleccionado en la semana de `selectedDay`, con los
 * hidratos planeados (amount × hc_amount de cada toma) y sus kcal.
 */
export const useFetchRacesForWeek = () => {
  const savedDate = useAppSelector((state) => state.config.selectedDay);
  const user = useAppSelector((state) => state.config.selectedUserId);

  const selectedDate = new FromDate(savedDate);
  const monday = selectedDate.thisMonday();
  const sunday = selectedDate.thisSunday();

  return useQuery({
    queryKey: queryKeys({ userId: user }).user.races(
      monday.save(),
      sunday.save(),
    ),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nutri_races")
        .select(selectRacesWithHc())
        .eq("user_id", user || "")
        .gte("race_date", monday.save())
        .lte("race_date", sunday.save())
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
          name: race.name,
          date: race.race_date,
          distanceKm: race.distance_km,
          gpxPath: race.gpx_path,
          totalHc,
          totalKcal: hcToKcal(totalHc),
        };
      });
    },
    enabled: !!user,
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
type SaveRacePlanArgs = Database["public"]["Functions"]["save_race_plan"]["Args"];

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

type ParsedGpx = Pick<SaveRacePlanArgs, "p_name" | "p_distance_km"> & {
  p_gpx_path: string;
  p_steps: RaceStepDraft[];
};

/**
 * Sube el gpx a race_gpx/<nutri_id>/ y lo procesa con la edge function parse-gpx.
 * No guarda la carrera: devuelve el perfil para revisarlo en el borrador.
 */
export const useParseGpx = () => {
  const { data: sessionData } = useGetAuthSession();
  const nutriId = sessionData?.userId ?? "";

  return useMutation({
    mutationFn: async (file: File) => {
      // Prefijo de tiempo para no pisar otro gpx con el mismo nombre
      const safeName = file.name.replace(/[^\w.-]+/g, "_");
      const gpxPath = `${nutriId}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(GPX_BUCKET)
        .upload(gpxPath, file, {
          contentType: file.type || "application/gpx+xml",
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data, error } = await supabase.functions.invoke<ParsedGpx>(
        "parse-gpx",
        { body: { gpx_path: gpxPath } },
      );

      if (error || !data) {
        // Ninguna carrera lo usa todavía: no se deja huérfano
        await removeUnusedGpx([gpxPath]);
      }
      if (error) {
        // parse-gpx explica en { error } por qué el gpx no es válido (422)
        if (error instanceof FunctionsHttpError) {
          const body = await error.context.json().catch(() => null);
          throw new Error(body?.error ?? error.message);
        }
        throw error;
      }
      if (!data) {
        throw new Error("parse-gpx returned no data");
      }
      return data;
    },
  });
};

export const useSaveRacePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draft: RacePlanDraft) => {
      if (draft.distanceKm === null) throw new Error("Race distance is required");

      const { data, error } = await supabase.rpc("save_race_plan", {
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
      return data;
    },
    onSuccess: (_raceId, draft) => {
      // Recalcula la fila de carreras y el balance energético de la tabla
      queryClient.invalidateQueries({
        queryKey: queryKeys({ userId: draft.userId }).user.racesBase,
      });
    },
  });
};

/**
 * Descarga el svg final de una carrera: lo genera la edge function display-gpx
 * con los datos guardados, la misma imagen que ve el corredor.
 */
export const useDownloadRaceImage = () => {
  const lang = useLanguageCode();

  return useMutation({
    mutationFn: async (race: { id: number; name: string; date: string }) => {
      // display-gpx responde image/svg+xml: invoke lo devuelve como texto
      const { data, error } = await supabase.functions.invoke<string>(
        "display-gpx",
        { body: { race_id: race.id, lang } },
      );

      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("display-gpx returned no data");
      }

      const url = URL.createObjectURL(
        new Blob([data], { type: "image/svg+xml" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `${race.date}-${race.name.replace(/[^\p{L}\p{N}._-]+/gu, "_")}.svg`;
      link.click();
      // Se revoca después: algunos navegadores leen el blob tras el click
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
  });
};

/**
 * Borra una carrera (tramos, ingredientes y landmarks caen en cascada) y su gpx.
 */
export const useDeleteRace = () => {
  const user = useAppSelector((state) => state.config.selectedUserId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, gpxPath }: { id: number; gpxPath: string | null }) => {
      const { error } = await supabase.from("nutri_races").delete().eq("id", id);

      if (error) {
        throw error;
      }

      if (gpxPath) {
        await removeUnusedGpx([gpxPath]);
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys({ userId: user }).user.racesBase,
      });
    },
  });
};
