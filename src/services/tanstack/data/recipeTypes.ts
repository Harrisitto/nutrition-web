import { useEffect, useState } from "react";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@src/services/supabase/client";
import { TABLE_RECIPE_TYPES } from "@src/services/supabase/definitions";
import { useLanguageCode } from "@src/hooks/helpers/language";
import type { SupportedLanguage } from "@src/services/i18n/config";
import { queryKeys } from "../keys";

const RECIPE_TYPES_PAGE_SIZE = 20;

const selectRecipeTypes = (lang: SupportedLanguage) =>
  `id, kcal, prot, fat, hc, name: name->>${lang}, comment: comment->>${lang}` as const;

/**
 * Tipos de receta paginados, filtrados por nombre en el idioma actual.
 * `searchStr` se aplica con debounce para no lanzar una query por tecla.
 */
export const useFetchRecipeTypes = ({
  searchStr = "",
  enabled = true,
}: {
  searchStr?: string;
  enabled?: boolean;
} = {}) => {
  const langCode = useLanguageCode();
  const [search, setSearch] = useState(searchStr);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchStr), 500);
    return () => clearTimeout(timeout);
  }, [searchStr]);

  return useInfiniteQuery({
    queryKey: queryKeys({
      language: langCode,
      searchStr: search,
    }).data.recipeTypes,
    queryFn: async ({ pageParam }) => {
      const nameCol = `${TABLE_RECIPE_TYPES.COLS.NAME}->>${langCode}`;
      let query = supabase
        .from(TABLE_RECIPE_TYPES.NAME)
        .select(selectRecipeTypes(langCode));

      if (search) {
        query = query.ilike(nameCol, `%${search}%`);
      }

      const { data, error } = await query
        .order(nameCol)
        // Desempate estable para que el offset no repita ni salte filas
        .order(TABLE_RECIPE_TYPES.COLS.ID)
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
        .from(TABLE_RECIPE_TYPES.NAME)
        .select(selectRecipeTypes(langCode))
        .eq(TABLE_RECIPE_TYPES.COLS.ID, recipeTypeId!)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: recipeTypeId !== null,
  });
};
