import { supabase } from "@src/services/supabase/client";

export const doIngredientsMatchRecipeType = async (
    ingredients: { id: number; amount: number }[],
    recipeTypeId: number
): Promise<boolean> => {

    const { ingredientIds, amounts } = ingredients.reduce((acc, ingredient) => {
        acc.ingredientIds.push(ingredient.id);
        acc.amounts.push(ingredient.amount);
        return acc;
    }, { 
        ingredientIds: [] as number[], 
        amounts: [] as number[] 
    });

    const { data, error } = await supabase.rpc('custom_ingredients_match_type', {
        p_ingredient_ids: ingredientIds,
        p_amounts: amounts,
        p_type_id: recipeTypeId
    });

    if (error) {
        throw new Error(`Error checking if ingredients match recipe type: ${error.message}`);
    }

    return data;
}
