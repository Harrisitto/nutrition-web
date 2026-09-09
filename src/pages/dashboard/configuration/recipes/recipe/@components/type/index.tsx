import { useTranslation } from "react-i18next";
import { useFetchRecipeInfo } from "@src/services/tanstack/data/recipes";

export const RecipeType = ({
    recipeId,
}: {
    recipeId: number;
}) => {
    const { data: recipe } = useFetchRecipeInfo({ recipeId });
    const { t } = useTranslation(); 

    if (!recipe || !recipe.type_id) {
        return null;
    }

    return (
        <div>
            <h2 className="text-base font-semibold uppercase tracking-wide text-text-title">
              {recipe.type_id.name}
            </h2>
            <div className="mt-2 grid gap-1 text-sm font-medium text-text-subtitle">
              <p>
                <span className="text-text-muted">
                  {t("data:macronutrients.carbs")}:
                </span>{" "}
                <span className="font-semibold text-text-title">
                  {recipe.type_id.hc}g
                </span>
              </p>
              <p>
                <span className="text-text-muted">
                  {t("data:macronutrients.protein")}:
                </span>{" "}
                <span className="font-semibold text-text-title">
                  {recipe.type_id.prot}g
                </span>
              </p>
              <p>
                <span className="text-text-muted">
                  {t("data:macronutrients.fats")}:
                </span>{" "}
                <span className="font-semibold text-text-title">
                  {recipe.type_id.fat}g
                </span>
              </p>
            </div>
        </div>
    )
}