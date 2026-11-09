import { Macros } from "@src/helpers/macros";
import {
  mealIngredientMacros,
  type CustomIngredient,
  type DraftMealIngredient,
} from "@src/services/tanstack/data/ingredients";
import type { CustomRecipe } from "@src/services/tanstack/user/customRecipes";

// La cantidad se guarda como texto mientras se escribe ("" o "1." son válidos al teclear)
export type DraftRecipeIngredient = { ingredientId: number; amount: string };

/** Texto para buscar sin distinguir mayúsculas ni acentos */
export const normalizeSearch = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/** Cantidad válida (> 0) o null si el texto no lo es */
export const parseAmount = (amount: string) => {
  const value = Number(amount);
  return amount !== "" && Number.isFinite(value) && value > 0 ? value : null;
};

/** Macros totales de una receta propia: suma de sus alimentos según su cantidad */
export const recipeMacros = (recipe: CustomRecipe) =>
  Macros.sum(
    recipe.ingredients.flatMap((row) =>
      row.ingredient ? [mealIngredientMacros(row.ingredient, row.amount)] : [],
    ),
  );

/**
 * Macros totales de un borrador de alimentos. Las filas con cantidad inválida o con un alimento que
 * aún no está en el catálogo cargado no suman
 */
export const draftMacros = (
  draft: DraftRecipeIngredient[],
  catalogById: Map<number, CustomIngredient>,
) =>
  Macros.sum(
    draft.flatMap((row) => {
      const ingredient = catalogById.get(row.ingredientId);
      const amount = parseAmount(row.amount);
      return ingredient && amount !== null ? [mealIngredientMacros(ingredient, amount)] : [];
    }),
  );

/** Comentario de la comida al planificar una receta propia: "Nombre: descripción" */
export const customRecipeComment = (recipe: Pick<CustomRecipe, "name" | "description">) => {
  const description = recipe.description?.trim();
  return description ? `${recipe.name}: ${description}` : recipe.name;
};

/** Los alimentos de una receta propia como ingredientes de una comida del planing */
export const customRecipeIngredients = (recipe: CustomRecipe): DraftMealIngredient[] =>
  recipe.ingredients.flatMap((row) =>
    row.ingredient ? [{ ingredientId: row.ingredient.id, amount: row.amount }] : [],
  );
