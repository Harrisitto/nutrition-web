import { useMemo } from "react";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useLanguageCode } from "@src/hooks/helpers/language";
import { supabase } from "@src/services/supabase/client";
import { useAppSelector } from "@src/store/store";
import { useGetAuthSession } from "../auth/get";
import { selectIngredient } from "../data/ingredients";
import { queryKeys } from "../keys";
import { queryClient } from "../queryClient";

/*
 * Recetas propias (vistas user_recipes + user_recipe_ingredients, schemas/schema_recipes_user_recipes.sql
 * en nutrition-proton). Una receta es una lista de alimentos del catálogo (catalog_ingredients) con su
 * cantidad en una unidad del alimento (amount + unit_id), y su dueño (user_id) es un cliente o el
 * nutricionista. El nutricionista lee y escribe las suyas y las de sus clientes aceptados (escribir
 * requiere suscripción activa: 55000 sin ella, 42501 sin permiso).
 * Se guardan con la RPC upsert_custom_recipe con p_public_recipes (provisional, TODELETE.md en
 * nutrition-proton): receta y alimentos en una sola transacción.
 * Las recetas ya no tienen tipo: a qué tipos llega una receta lo decide la base de datos por sus macros.
 * Una receta aprobada (approved_at) no se borra: borrarla solo quita el autor y deja de verse.
 */

const RECIPES_TABLE = "user_recipes" as const;
const RECIPES_FOR_TYPE_PAGE_SIZE = 20;

const selectCustomRecipe = (language: ReturnType<typeof useLanguageCode>) =>
  `id, owner_id: user_id, name: name->>${language}, description: description->>${language},
  url, is_global, revised_at, approved_at,
  ingredients: user_recipe_ingredients(
    amount,
    unit_id,
    ingredient: catalog_ingredients(${selectIngredient(language)})
  )` as const;

export type CustomRecipe = NonNullable<
  ReturnType<typeof useFetchMyCustomRecipes>["data"]
>[number];

/**
 * Id del recipe_type de "receta propia" (RPC custom_recipe_type_id). Al elegir ese tipo en el
 * planing se ofrecen las recetas propias del nutricionista y del cliente en vez de las del catálogo
 */
export const useSelectCustomRecipeId = () => {
  return useQuery({
    queryKey: queryKeys().data.customRecipeTypeId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("custom_recipe_type_id");

      if (error) {
        throw error;
      }
      return data;
    },
    staleTime: Infinity,
  });
};

/** Recetas propias de `ownerId`, ordenadas por nombre */
const useFetchCustomRecipesOf = (ownerId: string | null | undefined) => {
  const language = useLanguageCode();

  return useQuery({
    queryKey: queryKeys({ userId: ownerId, language }).user.customRecipes,
    queryFn: async () => {
      if (!ownerId) throw new Error("Owner ID is required to fetch custom recipes");
      const { data, error } = await supabase
        .from(RECIPES_TABLE)
        .select(selectCustomRecipe(language))
        .eq("user_id", ownerId);

      if (error) {
        throw error;
      }
      // Ordenado aquí: `order("name")` ordenaría por el JSON, no por el texto traducido
      return data
        .map((recipe) => ({ ...recipe, name: recipe.name ?? "" }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    enabled: !!ownerId,
  });
};

/** Recetas propias del nutricionista autenticado */
export const useFetchMyCustomRecipes = () => {
  const { data: session } = useGetAuthSession();
  return useFetchCustomRecipesOf(session?.userId);
};

/** Recetas propias del cliente seleccionado */
export const useFetchClientCustomRecipes = () => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  return useFetchCustomRecipesOf(userId);
};

/** Lo que necesitan la lista y el gestor de recetas: una query o la unión de varias */
export type CustomRecipesQuery = {
  data: CustomRecipe[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

/** Recetas del cliente seleccionado y del nutricionista juntas, ordenadas por nombre */
export const useFetchClientAndMyCustomRecipes = (): CustomRecipesQuery => {
  const client = useFetchClientCustomRecipes();
  const mine = useFetchMyCustomRecipes();

  const data = useMemo(
    () =>
      client.data && mine.data
        ? [...client.data, ...mine.data].sort((a, b) => a.name.localeCompare(b.name))
        : undefined,
    [client.data, mine.data],
  );

  return {
    data,
    isLoading: client.isLoading || mine.isLoading,
    isError: client.isError || mine.isError,
  };
};

/**
 * Recetas propias (RPC get_custom_recipes_for_type con p_public_recipes): las del nutricionista y las
 * del cliente seleccionado que se pueden fijar en una comida de `typeId` (sus macros llegan a las del
 * tipo; en el tipo receta propia, todas), paginadas por cursor (id de la última). Solo traen los datos
 * de la receta, sin alimentos
 */
export const useFetchCustomRecipesForType = ({
  typeId,
  search = "",
  enabled = true,
}: {
  typeId?: number;
  search?: string;
  enabled?: boolean;
}) => {
  const userId = useAppSelector((state) => state.config.selectedUserId);

  return useInfiniteQuery({
    queryKey: queryKeys({ userId, searchStr: search }).user.customRecipesForType(typeId),
    queryFn: async ({ pageParam }) => {
      const { data, error } = await supabase.rpc("get_custom_recipes_for_type", {
        p_user_id: userId!,
        p_type_id: typeId!,
        p_public_recipes: true,
        p_search: search || undefined,
        p_page_size: RECIPES_FOR_TYPE_PAGE_SIZE,
        p_after_id: pageParam ?? undefined,
      });

      if (error) {
        throw error;
      }
      return data;
    },
    initialPageParam: null as number | null,
    // Página incompleta = no hay más
    getNextPageParam: (lastPage): number | undefined => {
      const last = lastPage.at(-1);
      if (!last || lastPage.length < RECIPES_FOR_TYPE_PAGE_SIZE) return undefined;
      return last.id;
    },
    enabled: enabled && !!userId && typeId !== undefined,
  });
};

/**
 * Crea (sin `id`) o actualiza una receta propia con la lista completa de sus alimentos: los que no
 * vienen se borran de la receta. `toClient`: la receta nueva es del cliente seleccionado; si no, del
 * nutricionista. Al actualizar, el dueño no cambia. Devuelve el id de la receta
 */
export const useUpsertCustomRecipe = ({ toClient = false }: { toClient?: boolean } = {}) => {
  const userId = useAppSelector((state) => state.config.selectedUserId);
  const { data: session } = useGetAuthSession();
  const nutriId = session?.userId;
  const ownerId = toClient ? userId : nutriId;

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      ingredients,
    }: {
      id?: number;
      name: string;
      description: string | null;
      ingredients: { ingredient_id: number; amount: number; unit_id: number }[];
    }) => {
      if (!id && !ownerId) throw new Error("Owner ID is required to save a custom recipe");
      const { data, error } = await supabase.rpc("upsert_custom_recipe", {
        // Los tipos generados no marcan los argumentos como nullables, pero la RPC acepta null:
        // p_id null crea la receta y p_description null la deja sin descripción
        p_id: (id ?? null) as number,
        // Al actualizar el dueño no cambia: null evita el error 22023 si la receta es de otro dueño
        // (p.ej. una del nutricionista editada desde la página del cliente)
        p_owner_id: (id ? null : ownerId) as string,
        p_name: name.trim(),
        p_description: (description?.trim() || null) as string,
        p_ingredients: ingredients,
        // Provisional (TODELETE.md): escribe en public_recipes por user_recipes y user_recipe_ingredients
        p_public_recipes: true,
      });

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      // Una receta editada puede ser de otro dueño que ownerId: se refrescan todas
      queryClient.invalidateQueries({
        queryKey: queryKeys().user.customRecipesAll,
      });
    },
  });
};

/**
 * Borra una receta propia (sus alimentos se borran en cascada). Una aprobada no se borra: pierde el
 * autor y deja de verse igual. 42501 si es una receta que quedó al juntar duplicados
 */
export const useDeleteCustomRecipe = () => {
  return useMutation({
    mutationFn: async (recipeId: number) => {
      const { data, error } = await supabase
        .from(RECIPES_TABLE)
        .delete()
        .eq("id", recipeId)
        .select("id, owner_id: user_id")
        // Sin fila borrada (no existe o la RLS no deja) maybeSingle da null en vez de error
        .maybeSingle();

      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("Custom recipe not found");
      }
      return data;
    },
    onSuccess: ({ id, owner_id }) => {
      queryClient.setQueriesData<CustomRecipe[]>(
        { queryKey: queryKeys({ userId: owner_id }).user.customRecipesBase },
        (old) => old?.filter((recipe) => recipe.id !== id),
      );
      // Las listas por tipo son InfiniteData y mezclan dueños: se recargan
      queryClient.invalidateQueries({
        queryKey: queryKeys().user.customRecipesForTypeBase,
      });
    },
  });
};
