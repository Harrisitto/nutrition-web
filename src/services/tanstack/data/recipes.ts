import { useLanguageCode } from "@src/hooks/helpers/language"
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { useEffect, useState } from "react";
import { supabase } from "@src/services/supabase/client";
import type { SupportedLanguage } from "@src/services/i18n/config";
import { Macros } from "@src/helpers/macros";
import { queryClient } from "../queryClient";
import { useGetAuthSession } from "../auth/get";
import { useAppSelector } from "../../../store/store";
import { mealIngredientMacros } from "./ingredients";

/*
 * Recetas del catálogo (vista catalog_recipes: publicadas y revisadas, las globales de los editores y las
 * recetas por defecto) y la valoración del nutricionista (nutri_recipe_ratings, 0-100).
 * Las recetas ya no tienen tipo: a qué tipos llega una la decide la base de datos por sus macros, moviendo
 * cada ingrediente entre su mínimo y su máximo. Las macros que se muestran aquí son las de la receta con
 * sus cantidades tal cual (catalog_recipe_ingredients).
 */

type RecipeInfo = NonNullable<ReturnType<typeof useFetchRecipeInfo>["data"]>;

const TOP_RECIPES_PAGE_SIZE = 20;

// Lo justo de cada alimento para calcular las macros de la receta
const selectIngredientMacros = `
    amount,
    unit_id,
    ingredient: catalog_ingredients(kcal, prot: protein, hc: carbs, fat, units: catalog_ingredient_units(unit_id, grams))
` as const;

export const selectRecipes = (lang: SupportedLanguage) => {
    return `
    id,
    url,
    name: name->>${lang},
    ingredients: catalog_recipe_ingredients(${selectIngredientMacros}),
    nutri_recipe: nutri_recipe_ratings(rating)
    ` as const;
}

export const selectRecipeInfo = (lang: SupportedLanguage) => {
    return `
    id,
    url,
    name: name->>${lang},
    description: description->>${lang},
    ingredients: catalog_recipe_ingredients(
        amount,
        unit_id,
        ingredient_id,
        comment: comment->>${lang},
        ingredient: catalog_ingredients(name: name->>${lang}, kcal, prot: protein, hc: carbs, fat, units: catalog_ingredient_units(unit_id, grams))
    ),
    nutri_recipe: nutri_recipe_ratings(rating)
` as const;
}

/** Macros de una receta con las cantidades de sus alimentos */
const recipeMacros = (
    ingredients: {
        amount: number;
        unit_id: number;
        ingredient: Parameters<typeof mealIngredientMacros>[0] | null;
    }[],
) =>
    Macros.sum(
        ingredients.flatMap(({ amount, unit_id, ingredient }) =>
            ingredient ? [mealIngredientMacros(ingredient, amount, unit_id)] : [],
        ),
    );

export const useFetchRecipes = ({
    searchStr = '',
}: {
    searchStr: string;
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
        }).data.recipes([]),
        queryFn: async () => {
            const { data, error } = await supabase
                .from("catalog_recipes")
                .select(selectRecipes(langCode))
                .ilike("name->>" + langCode, `%${search}%`);

            if (error) {
                throw error;
            }

            // Las recetas por defecto (id negativo) no tienen ingredientes ni foto
            const recipes = data.filter((recipe) => recipe.id > 0);

            const signedUrls = await supabase.storage.from('recipe_images').createSignedUrls(
                recipes.map(recipe => `receta_${recipe.id}.jpg`),
                60 * 60 // 1 hour
            );

            return recipes.map(({ ingredients, ...recipe }, index) => ({
                ...recipe,
                macros: recipeMacros(ingredients),
                url: signedUrls.data ? signedUrls.data[index]?.signedUrl : recipe.url,
            }));
        },
        placeholderData: [],
    });
}

type TopRecipesCursor = { score: number; id: number } | null;

/**
 * Recetas que el cliente puede planificar en un tipo, ordenadas por score (RPC
 * scored_search_recipes_for_type) y paginadas por cursor: del catálogo, del cliente y de su
 * nutricionista que llegan a las macros del tipo. En el tipo de receta propia, cualquiera de ellas
 */
export const useFetchTopRecipesForUser = ({
    typeId,
    search = '',
    enabled = true,
}: {
    typeId?: number;
    search?: string;
    enabled?: boolean;
}) => {
    const langCode = useLanguageCode();
    const userId = useAppSelector(state => state.config.selectedUserId);

    return useInfiniteQuery({
        queryKey: queryKeys({
            language: langCode,
            userId,
            searchStr: search,
        }).data.topRecipesForUser(typeId),
        queryFn: async ({ pageParam }) => {
            const { data, error } = await supabase.rpc("scored_search_recipes_for_type", {
                p_client_id: userId!,
                p_type_id: typeId!,
                p_lang: langCode,
                p_search: search || undefined,
                p_page_size: TOP_RECIPES_PAGE_SIZE,
                p_after_score: pageParam?.score,
                p_after_id: pageParam?.id,
            });

            if (error) {
                throw error;
            }

            if (!data.length) {
                return data.map(recipe => ({ ...recipe, url: null as string | null }));
            }

            const signedUrls = await supabase.storage.from('recipe_images').createSignedUrls(
                data.map(recipe => `receta_${recipe.id}.jpg`),
                60 * 60 // 1 hour
            );

            return data.map((recipe, index) => ({
                ...recipe,
                url: signedUrls.data?.[index]?.signedUrl ?? null,
            }));
        },
        initialPageParam: null as TopRecipesCursor,
        // Cursor = (score, id) de la ultima receta. Pagina incompleta = no hay mas
        getNextPageParam: (lastPage): TopRecipesCursor | undefined => {
            const last = lastPage.at(-1);
            if (!last || lastPage.length < TOP_RECIPES_PAGE_SIZE) return undefined;
            return { score: last.score, id: last.id };
        },
        enabled: enabled && !!userId && typeId !== undefined,
    });
};

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
                .from("catalog_recipes")
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
                macros: recipeMacros(data.ingredients),
                url: signedUrl.data ? signedUrl.data?.signedUrl : null,
            };
        },
        enabled: !!recipeId,
    });
}

/**
 * Valoración del nutricionista (0-100). nutri_recipe_ratings no admite upsert (INSTEAD OF): se cambia la
 * suya y, si aún no tenía, se crea
 */
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
            const { data: updated, error: updateError } = await supabase
                .from("nutri_recipe_ratings")
                .update({ rating })
                .eq("recipe_id", recipeId)
                .eq("nutri_id", nutriId)
                .select("*");
            if (updateError) {
                throw updateError;
            }
            if (updated.length) {
                return updated[0];
            }

            const { data, error } = await supabase
                .from("nutri_recipe_ratings")
                .insert({ recipe_id: recipeId, rating })
                .select("*")
                .single();
            if (error) {
                throw error;
            }
            return data;
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
                        nutri_recipe: [{ rating: newRating }],
                    };
                }
            );

            // Todas las busquedas cacheadas que puedan contener la receta
            queryClient.setQueriesData(
                {
                    queryKey: queryKeys({
                        language: langCode,
                    }).data.recipesBase,
                },
                (oldData: RecipeInfo[] | undefined) => {
                    if (!oldData) return oldData;
                    return oldData.map(recipe =>
                        recipe.id === recipeId
                            ? { ...recipe, nutri_recipe: [{ rating: newRating }] }
                            : recipe,
                    );
                }
            );
        },
        onSettled: () => {
            // El rating cambia el orden del top: refetch en vez de parchear las paginas
            queryClient.invalidateQueries({
                queryKey: queryKeys().data.topRecipesBase,
            });
        },
    });
}
