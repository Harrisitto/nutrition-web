import { mealIngredientMacros } from "@src/services/tanstack/data/ingredients";
import type { CustomRecipe } from "@src/services/tanstack/user/customRecipes";

// La cantidad se guarda como texto mientras se escribe ("" o "1." son válidos al teclear)
export type DraftRecipeIngredient = { ingredientId: number; amount: string };

/** Cantidad válida (> 0) o null si el texto no lo es */
export const parseAmount = (amount: string) => {
  const value = Number(amount);
  return amount !== "" && Number.isFinite(value) && value > 0 ? value : null;
};

/** Macros totales de una receta propia: suma de sus alimentos según su cantidad */
export const recipeMacros = (recipe: CustomRecipe) =>
  recipe.ingredients.reduce(
    (acc, row) => {
      if (!row.ingredient) return acc;
      const m = mealIngredientMacros(row.ingredient, row.amount);
      return {
        kcal: acc.kcal + m.kcal,
        prot: acc.prot + m.prot,
        hc: acc.hc + m.hc,
        fat: acc.fat + m.fat,
      };
    },
    { kcal: 0, prot: 0, hc: 0, fat: 0 },
  );

/** Comentario de la comida al planificar una receta propia: "Nombre: descripción" */
export const customRecipeComment = (recipe: Pick<CustomRecipe, "name" | "description">) => {
  const description = recipe.description?.trim();
  return description ? `${recipe.name}: ${description}` : recipe.name;
};
