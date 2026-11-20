import { useTranslation } from "react-i18next";
import { useFetchRecipeInfo } from "@src/services/tanstack/data/recipes";

export const RecipeType = ({
    recipeId,
}: {
    recipeId: number;
}) => {
    const { data: recipe } = useFetchRecipeInfo({ recipeId });
    const { t } = useTranslation(); 

    // Las recetas ya no tienen tipo: macros de la receta con sus cantidades
    if (!recipe) {
        return null;
    }

    return (
        <div>
            <h2 className="text-base font-semibold uppercase tracking-wide text-text-title">
              {Math.round(recipe.macros.kcal)} kcal
            </h2>
            <div className="mt-2 grid gap-1 text-sm font-medium text-text-subtitle">
              <p>
                <span className="text-text-muted">
                  {t("data:macronutrients.carbs")}:
                </span>{" "}
                <span className="font-semibold text-text-title">
                  {Math.round(recipe.macros.hc)}g
                </span>
              </p>
              <p>
                <span className="text-text-muted">
                  {t("data:macronutrients.protein")}:
                </span>{" "}
                <span className="font-semibold text-text-title">
                  {Math.round(recipe.macros.prot)}g
                </span>
              </p>
              <p>
                <span className="text-text-muted">
                  {t("data:macronutrients.fats")}:
                </span>{" "}
                <span className="font-semibold text-text-title">
                  {Math.round(recipe.macros.fat)}g
                </span>
              </p>
            </div>
        </div>
    )
}