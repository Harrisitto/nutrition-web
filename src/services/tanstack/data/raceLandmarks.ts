import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { useLanguageCode } from "@src/hooks/helpers/language";
import type { SupportedLanguage } from "@src/services/i18n/config";

/**
 * Catálogo de tipos de punto de interés (avituallamiento, cima...) con su icono, con los
 * nombres en `language` (por defecto, el de la web). El bucket race_landmarks es público: url
 * ya es la url pública del icono.
 */
export const useFetchRaceLandmarkOptions = (language?: SupportedLanguage) => {
  const webLangCode = useLanguageCode();
  const langCode = language ?? webLangCode;

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
