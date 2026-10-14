import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { useLanguageCode } from "@src/hooks/helpers/language";

/**
 * Catálogo de tipos de punto de interés (avituallamiento, cima...) con su icono.
 * El bucket race_landmarks es público: url ya es la url pública del icono.
 */
export const useFetchRaceLandmarkOptions = () => {
  const langCode = useLanguageCode();

  return useQuery({
    queryKey: queryKeys({ language: langCode }).data.raceLandmarks,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("all_race_landmarks")
        .select(`id, url, name: name->>${langCode}`)
        .order("id");

      if (error) {
        throw error;
      }
      return data;
    },
    staleTime: Infinity,
  });
};
