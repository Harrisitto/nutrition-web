import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { queryClient } from "../queryClient";
import { useGetAuthSession } from "../auth/get";
import type { ViewInsert, ViewRow } from "@src/services/supabase/database";
import { resizeImage } from "@src/helpers/images";

// Ingredientes de carrera del nutricionista: la vista nutri_race_foods (migración
// 20261112130100_schema_races en nutrition-proton), que solo devuelve los suyos
type RaceIngredientRow = ViewRow<"nutri_race_foods">;
export type RaceIngredient = RaceIngredientRow & { image_url: string | null };
export type NewRaceIngredient = Pick<
    ViewInsert<"nutri_race_foods">,
    "name" | "hc_amount" | "sodium_amount" | "caffeine_amount" | "liquid_amount"
>;

// El ingrediente se ha creado pero no se ha podido subir su imagen
export class RaceIngredientImageError extends Error {}

const IMAGES_BUCKET = "race_ingredients";
const SIGNED_URL_TTL = 60 * 60; // 1 hora
const MAX_IMAGE_WIDTH = 300; // px

// La ruta de la imagen en el bucket (<nutri_id>/<ingredient_id>) la da la vista: image_path
const withImageUrls = async <T extends { image_path: string }>(
    ingredients: T[]
): Promise<(T & { image_url: string | null })[]> => {
    if (!ingredients.length) return [];

    // Los ficheros que no existen vuelven como entradas con error, no como excepción
    const { data: signed, error } = await supabase.storage
        .from(IMAGES_BUCKET)
        .createSignedUrls(
            ingredients.map((ingredient) => ingredient.image_path),
            SIGNED_URL_TTL
        );

    if (error) {
        console.error("Error fetching race ingredient images:", error);
    }

    return ingredients.map((ingredient, index) => ({
        ...ingredient,
        image_url: signed?.[index]?.signedUrl ?? null,
    }));
};

const sortByName = (ingredients: RaceIngredient[]) =>
    [...ingredients].sort((a, b) => a.name.localeCompare(b.name));

/**
 * Catálogo de ingredientes de carrera del nutricionista, incluidos los de
 * borrado lógico: las carreras pueden seguir usándolos y hay que mostrar su
 * nombre, imagen y HC. Para elegir ingredientes nuevos se filtra `is_deleted`.
 */
export const useFetchRaceIngredients = () => {
    const { data: sessionData } = useGetAuthSession();
    const nutriId = sessionData?.userId ?? "";

    return useQuery({
        queryKey: queryKeys({ userId: nutriId }).data.raceIngredients,
        queryFn: async () => {
            // La vista y no la RPC scored_search: aqui hacen falta tambien los borrados
            const { data, error } = await supabase
                .from("nutri_race_foods")
                .select("*")
                .order("name");

            if (error) {
                throw error;
            }
            return withImageUrls(data);
        },
        enabled: !!nutriId,
        // Se refresca antes de que caduquen las URLs firmadas
        staleTime: (SIGNED_URL_TTL - 10 * 60) * 1000,
    });
};

/**
 * Ingredientes que se pueden añadir a una carrera (sin los borrados), ordenados por score
 * (RPC scored_search_race_ingredients_for_user). `clientId` es el cliente de la carrera; `null` busca
 * sin cliente. Las cantidades son opcionales: sin ellas no filtran y el score las cuenta como 0.
 * Para nombre, imagen o HC de un ingrediente ya puesto: useRaceIngredientCatalog (incluye borrados).
 */
export const useFetchScoredRaceIngredients = ({
    clientId = null,
    searchStr = "",
    amounts = {},
}: {
    clientId?: string | null;
    searchStr?: string;
    amounts?: {
        carbs?: number | null;
        sodium?: number | null;
        caffeine?: number | null;
        liquid?: number | null;
    };
} = {}) => {
    const { data: sessionData } = useGetAuthSession();
    const nutriId = sessionData?.userId ?? "";
    const { carbs = null, sodium = null, caffeine = null, liquid = null } = amounts;
    const [search, setSearch] = useState(searchStr);

    // Debounce: no se lanza una query por tecla
    useEffect(() => {
        const timeout = setTimeout(() => setSearch(searchStr), 300);
        return () => clearTimeout(timeout);
    }, [searchStr]);

    return useQuery({
        queryKey: [
            ...queryKeys({ userId: clientId, searchStr: search }).data.scoredRaceIngredients,
            carbs,
            sodium,
            caffeine,
            liquid,
        ],
        queryFn: async () => {
            const { data, error } = await supabase.rpc("scored_search_race_ingredients_for_user", {
                p_user_id: clientId,
                p_search_text: search || null,
                p_carbs_amount: carbs,
                p_sodium_amount: sodium,
                p_caffeine_amount: caffeine,
                p_liquid_amount: liquid,
            });

            if (error) {
                throw error;
            }
            return withImageUrls(data);
        },
        enabled: !!nutriId,
        // Mientras se escribe se mantiene la lista anterior en vez de vaciarla
        placeholderData: keepPreviousData,
        // Se refresca antes de que caduquen las URLs firmadas
        staleTime: (SIGNED_URL_TTL - 10 * 60) * 1000,
    });
};

export type ScoredRaceIngredient = NonNullable<
    ReturnType<typeof useFetchScoredRaceIngredients>["data"]
>[number];

/**
 * Catálogo por id (para mostrar las tomas de una carrera, aunque el
 * ingrediente esté borrado) y los ingredientes que se pueden añadir.
 */
export const useRaceIngredientCatalog = () => {
    const { data, isLoading } = useFetchRaceIngredients();

    return useMemo(() => {
        const ingredients = data ?? [];
        return {
            byId: new Map(ingredients.map((ingredient) => [ingredient.id, ingredient])),
            available: ingredients.filter((ingredient) => !ingredient.is_deleted),
            isLoading,
        };
    }, [data, isLoading]);
};

export const useAddRaceIngredient = () => {
    const { data: sessionData } = useGetAuthSession();
    const nutriId = sessionData?.userId ?? "";

    return useMutation({
        mutationFn: async ({
            ingredient,
            image,
        }: {
            ingredient: NewRaceIngredient;
            image?: File | null;
        }) => {
            // Antes del insert: si la imagen no se puede leer no se crea el ingrediente
            const resizedImage = image ? await resizeImage(image, MAX_IMAGE_WIDTH) : null;

            const { data, error } = await supabase
                .from("nutri_race_foods")
                .insert({ ...ingredient, nutri_id: nutriId })
                .select("*")
                .single();

            if (error) {
                throw error;
            }

            if (resizedImage) {
                const { error: uploadError } = await supabase.storage
                    .from(IMAGES_BUCKET)
                    .upload(data.image_path, resizedImage, {
                        contentType: resizedImage.type,
                    });

                if (uploadError) {
                    // El ingrediente se ha creado igualmente: se muestra sin imagen
                    queryClient.invalidateQueries({
                        queryKey: queryKeys({ userId: nutriId }).data.raceIngredients,
                    });
                    throw new RaceIngredientImageError(uploadError.message);
                }
            }

            const [withImage] = await withImageUrls([data]);
            return withImage;
        },
        onSuccess: (newIngredient) => {
            queryClient.setQueryData(
                queryKeys({ userId: nutriId }).data.raceIngredients,
                (oldData: RaceIngredient[] | undefined) =>
                    sortByName([...(oldData ?? []), newIngredient])
            );
            queryClient.invalidateQueries({
                queryKey: queryKeys().data.scoredRaceIngredientsBase,
            });
        },
    });
};

// Borrado lógico: los planes de carrera pueden seguir usando el ingrediente
export const useDeleteRaceIngredient = () => {
    const { data: sessionData } = useGetAuthSession();
    const nutriId = sessionData?.userId ?? "";

    return useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase
                .from("nutri_race_foods")
                .update({ is_deleted: true })
                .eq("id", id);

            if (error) {
                throw error;
            }
            return id;
        },
        onSuccess: (deletedId) => {
            queryClient.setQueryData(
                queryKeys({ userId: nutriId }).data.raceIngredients,
                (oldData: RaceIngredient[] | undefined) =>
                    oldData?.map((ingredient) =>
                        ingredient.id === deletedId
                            ? { ...ingredient, is_deleted: true }
                            : ingredient
                    )
            );
            queryClient.invalidateQueries({
                queryKey: queryKeys().data.scoredRaceIngredientsBase,
            });
        },
    });
};
