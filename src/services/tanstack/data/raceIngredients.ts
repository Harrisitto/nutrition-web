import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { supabase } from "@src/services/supabase/client";
import { queryClient } from "../queryClient";
import { useGetAuthSession } from "../auth/get";
import type { Database } from "@src/services/supabase/types";

type RaceIngredientRow = Database["public"]["Tables"]["nutri_race_ingredients"]["Row"];
export type RaceIngredient = RaceIngredientRow & { image_url: string | null };
export type NewRaceIngredient = Pick<
    Database["public"]["Tables"]["nutri_race_ingredients"]["Insert"],
    "name" | "hc_amount" | "sodium_amount" | "caffeine_amount" | "liquid_amount"
>;

// El ingrediente se ha creado pero no se ha podido subir su imagen
export class RaceIngredientImageError extends Error {}

const IMAGES_BUCKET = "race_ingredients";
const SIGNED_URL_TTL = 60 * 60; // 1 hora

// Las imágenes van por convención en <nutri_id>/<ingredient_id>: no hace falta columna
const imagePath = (nutriId: string, ingredientId: number) => `${nutriId}/${ingredientId}`;

const withImageUrls = async (
    nutriId: string,
    ingredients: RaceIngredientRow[]
): Promise<RaceIngredient[]> => {
    if (!ingredients.length) return [];

    // Los ficheros que no existen vuelven como entradas con error, no como excepción
    const { data: signed, error } = await supabase.storage
        .from(IMAGES_BUCKET)
        .createSignedUrls(
            ingredients.map((ingredient) => imagePath(nutriId, ingredient.id)),
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
            const { data, error } = await supabase
                .from("nutri_race_ingredients")
                .select("*")
                .eq("nutri_id", nutriId)
                .order("name");

            if (error) {
                throw error;
            }
            return withImageUrls(nutriId, data);
        },
        enabled: !!nutriId,
        // Se refresca antes de que caduquen las URLs firmadas
        staleTime: (SIGNED_URL_TTL - 10 * 60) * 1000,
    });
};

/**
 * Catálogo por id (para mostrar las tomas de una carrera, aunque el
 * ingrediente esté borrado) y los ingredientes que se pueden añadir.
 */
export const useRaceIngredientCatalog = () => {
    const { data } = useFetchRaceIngredients();

    return useMemo(() => {
        const ingredients = data ?? [];
        return {
            byId: new Map(ingredients.map((ingredient) => [ingredient.id, ingredient])),
            available: ingredients.filter((ingredient) => !ingredient.is_deleted),
        };
    }, [data]);
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
            const { data, error } = await supabase
                .from("nutri_race_ingredients")
                .insert({ ...ingredient, nutri_id: nutriId })
                .select("*")
                .single();

            if (error) {
                throw error;
            }

            if (image) {
                const { error: uploadError } = await supabase.storage
                    .from(IMAGES_BUCKET)
                    .upload(imagePath(nutriId, data.id), image, {
                        contentType: image.type,
                    });

                if (uploadError) {
                    // El ingrediente se ha creado igualmente: se muestra sin imagen
                    queryClient.invalidateQueries({
                        queryKey: queryKeys({ userId: nutriId }).data.raceIngredients,
                    });
                    throw new RaceIngredientImageError(uploadError.message);
                }
            }

            const [withImage] = await withImageUrls(nutriId, [data]);
            return withImage;
        },
        onSuccess: (newIngredient) => {
            queryClient.setQueryData(
                queryKeys({ userId: nutriId }).data.raceIngredients,
                (oldData: RaceIngredient[] | undefined) =>
                    sortByName([...(oldData ?? []), newIngredient])
            );
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
                .from("nutri_race_ingredients")
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
        },
    });
};
