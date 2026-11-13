import { useEffect, useState } from "react";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@src/services/supabase/client";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { useGetAuthInfo } from "@src/services/tanstack/auth/get";
import type { SupportedLanguage } from "@src/services/i18n/config";
import { queryKeys } from "../keys";

const RECIPE_TYPES_PAGE_SIZE = 20;

const selectRecipeTypes = (lang: SupportedLanguage) =>
  `id, kcal, prot, fat, hc, name: name->>${lang}, comment: comment->>${lang}` as const;

/**
 * Tipos de receta paginados (RPC scored_search_recipe_types_for_client), ordenados por score: cuantas veces
 * se ha puesto cada tipo en la planificacion de `clientId` en el ultimo mes. Sin cliente (`null`) todos
 * tienen score 0 y salen por nombre.
 * El nombre sale en el `language_code` del nutricionista (nutri_profile), que useSyncProfileLanguage
 * mantiene igual al idioma de la web. La key usa ese idioma, asi se vuelve a pedir cuando cambia en la base.
 * `searchStr` se aplica con debounce para no lanzar una query por tecla.
 */
export const useFetchRecipeTypes = ({
  clientId = null,
  searchStr = "",
  enabled = true,
}: {
  clientId?: string | null;
  searchStr?: string;
  enabled?: boolean;
} = {}) => {
  const langCode = useLanguageCode();
  const { data: profile } = useGetAuthInfo();
  const [search, setSearch] = useState(searchStr);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchStr), 500);
    return () => clearTimeout(timeout);
  }, [searchStr]);

  return useInfiniteQuery({
    queryKey: queryKeys({
      userId: clientId,
      language: profile?.language_code ?? langCode,
      searchStr: search,
    }).data.recipeTypes,
    queryFn: async ({ pageParam }) => {
      const { data, error } = await supabase
        .rpc("scored_search_recipe_types_for_client", {
          p_client_id: clientId,
          p_search_text: search || null,
        })
        // La RPC ya ordena con desempate por id: el offset no repite ni salta filas
        .range(pageParam, pageParam + RECIPE_TYPES_PAGE_SIZE - 1);

      if (error) throw error;
      return data;
    },
    initialPageParam: 0,
    // Offset de la siguiente pagina. Pagina incompleta = no hay mas
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < RECIPE_TYPES_PAGE_SIZE
        ? undefined
        : allPages.length * RECIPE_TYPES_PAGE_SIZE,
    // Mientras se escribe se mantiene la lista anterior en vez de vaciarla
    placeholderData: keepPreviousData,
    enabled,
  });
};

/** Un tipo de receta por id (p.ej. el seleccionado, que puede no estar en las paginas cargadas) */
export const useFetchRecipeType = (recipeTypeId: number | null) => {
  const langCode = useLanguageCode();

  return useQuery({
    queryKey: queryKeys({ language: langCode }).data.recipeType(recipeTypeId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipe_type")
        .select(selectRecipeTypes(langCode))
        .eq("id", recipeTypeId!)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: recipeTypeId !== null,
  });
};
