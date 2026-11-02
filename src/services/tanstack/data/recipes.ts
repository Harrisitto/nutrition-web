import { useLanguageCode } from "@src/hooks/helpers/language"
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { useEffect, useState } from "react";
import { supabase } from "@src/services/supabase/client";
import type { SupportedLanguage } from "@src/services/i18n/config";
import { queryClient } from "../queryClient";
import { useGetAuthSession } from "../auth/get";

type RecipeInfo = NonNullable<ReturnType<typeof useFetchRecipeInfo>["data"]>;

export const selectRecipes = (lang: SupportedLanguage) => {
    return `
    id,
    url,
    name: name->>${lang},
    type_id!inner(
        id,
        kcal,
        prot,
        fat,
        hc,
        name: name->>${lang}
    ),
    nutri_recipe(*)
    ` as const;
}

export const selectRecipeInfo = (lang: SupportedLanguage) => {
    return   `
    id,
    url,
    name: name->>${lang},
    description: description->>${lang},
    type_id!inner(
        id,
        kcal,
        prot,
        fat,
        hc,
        name: name->>${lang}
    ),
    all_ingredients!inner(
        id,
        recipe_id,
        url,
        name: name->>${lang},
        amount: amount->>${lang},
        comment: comment->>${lang}
    ),
    nutri_recipe(*)
` as const;
}

export const useFetchRecipes = ({
    searchStr = '',
    typeIds = [],
}: {
    searchStr: string;
    typeIds?: number[];
}) => {
    const langCode = useLanguageCode();
    const [search, setSearch] = useState(searchStr);

    useEffect(() => {
        const timeout = setTimeout(() => setSearch(searchStr), 500);
        return () => clearTimeout(timeout);
    }, [searchStr]);

    return useQuery({
        queryKey: queryKeys({
            language: langCode,
            searchStr: search,
        }).data.recipes(typeIds),
        queryFn: async () => {
            let query = supabase
                .from("all_recipes")
                .select(selectRecipes(langCode))
                .ilike("name->>" + langCode, `%${search}%`);

            if (typeIds.length > 0) {
                query = query.in("type_id", typeIds);
            }

            const { data, error } = await query;

            if (error) {
                throw error;
            }

            const recipeIds = data?.map(recipe => recipe.id) || [];

            const signedUrls = await supabase.storage.from('recipe_images').createSignedUrls(
                recipeIds.map(id => `receta_${id}.jpg`),
                60 * 60 // 1 hour
            );

            return data?.map((recipe, index) => ({
                ...recipe,
                url: signedUrls.data ? signedUrls.data[index]?.signedUrl : recipe.url,
            })) || [];
        },
        placeholderData: [],
    });
}

export const useFetchRecipeInfo = ({
    recipeId,
}: {
    recipeId: number;
}) => {
    const langCode = useLanguageCode();

    return useQuery({
        queryKey: queryKeys({
            language: langCode,
        }).data.singleRecipe(recipeId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from("all_recipes")
                .select(selectRecipeInfo(langCode))
                .eq("id", recipeId)
                .single();

            if (error) {
                throw error;
            }

            const signedUrl = await supabase.storage.from('recipe_images').createSignedUrl(`receta_${recipeId}.jpg`, 60 * 60);

            if (signedUrl.error) {
                console.error("Error fetching signed URL:", signedUrl.error);
            }

            return {
                ...data,
                url: signedUrl.data ? signedUrl.data?.signedUrl : null,
            };
        },
        enabled: !!recipeId,
    });
}

export const useMutateNutriRecipe = ({
    recipeId,
}: {
    recipeId: number;
}) => {
    const langCode = useLanguageCode();
    const { data: sessionData } = useGetAuthSession();
    const nutriId = sessionData?.userId ?? '';

    return useMutation({
        mutationKey: queryKeys({
            language: langCode,
        }).data.singleRecipe(recipeId),
        mutationFn: async (rating: number) => {
            console.log("Updating rating to:", rating);
            const { data, error } = await supabase
                .from("nutri_recipe")
                .upsert({
                    recipe_id: recipeId,
                    nutri_id: nutriId,
                    rating,
                })
                .eq("recipe_id", recipeId)
                .eq("nutri_id", nutriId)
                .select("*")
                .single();
            if (error) {
                throw error;
            }
            return data || null;
        },
        onMutate: (newRating) => {
            // Optimistically update the cache
            queryClient.setQueryData(
                queryKeys({
                    language: langCode,
                }).data.singleRecipe(recipeId),
                (oldData: RecipeInfo) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        nutri_recipe: [{
                            ...oldData.nutri_recipe,
                            rating: newRating,
                        }],
                    };
                }
            );

            // Todas las busquedas cacheadas (texto y tipos) que puedan contener la receta
            queryClient.setQueriesData(
                {
                    queryKey: queryKeys({
                        language: langCode,
                    }).data.recipesBase,
                },
                (oldData: RecipeInfo[] | undefined) => {
                    if (!oldData) return oldData;
                    return oldData.map(recipe => {
                        if (recipe.id === recipeId) {
                            return {
                                ...recipe,
                                nutri_recipe: [{
                                    ...recipe.nutri_recipe,
                                    rating: newRating,
                                }],
                            };
                        }
                        return recipe;
                    });
                }
            );
        },
    });
}
