import { useMemo } from "react";
import {
  useFetchRecipeInfo,
  useMutateNutriRecipe,
} from "@src/services/tanstack/data/recipes";
import { ChevronLeft, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RecipePieChart } from "./@components/chart/pieChart";
import { IngredientsList } from "./@components/ingredients";
import { RecipeType } from "./@components/type";

export const ViewRecipe = ({
  searchStr,
  goBack,
  recipeId,
}: {
  searchStr: string;
  recipeId: number;
  goBack: () => void;
}) => {
  const { t } = useTranslation();
  const { data: recipe, isLoading } = useFetchRecipeInfo({ recipeId });
  const { mutate: updateRating } = useMutateNutriRecipe({ recipeId });

  const recipeRating = useMemo(() => {
    if (!recipe) return 0;
    const re = recipe.nutri_recipe[0]?.rating;
    return re ? re / 20 : 0; // Convert to 1-5 score
  }, [recipe]);



  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-nutrition-green">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <button
        type="button"
        className="mb-2 inline-flex items-center rounded-lg p-2 text-nutrition-green transition-colors hover:bg-white-green/60"
        onClick={goBack}
      >
        <ChevronLeft />
      </button>
      <div className="flex flex-row gap-6 rounded-2xl border border-nutrition-green/20 bg-gradient-to-br from-white to-white-green/70 p-5 shadow-md">
        <div className="aspect-square">
          <img
            src={recipe.url ?? undefined}
            alt={recipe.name}
            className="w-64 h-64 object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold uppercase text-text-title">
            {recipe.name}
          </h2>
          <p className="text-text-subtitle">{recipe.description}</p>
          <div>
            <label className="block mb-1 font-medium text-sm text-text-subtitle">
              {t("data:configuration.sections.recipes.rating")}
            </label>
            <div className="relative">
              <div className="absolute w-48 flex flex-row justify-between">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < recipeRating
                        ? "text-yellow-400 text-3xl"
                        : "text-nutrition-green/20 text-3xl"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={recipeRating}
                onChange={(e) => updateRating(Number(e.target.value) * 20)}
                className="w-48 absolute opacity-0 h-12 cursor-pointer"
                style={{ top: 0, left: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-6 mt-6">
        <div className="flex flex-row gap-6">
          <div className="flex flex-col items-center gap-4 w-72 rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-center text-text-title">
              {t("data:configuration.sections.recipes.macros")}
            </h3>
            <RecipePieChart recipeId={recipeId} />
          </div>
          <div className="rounded-2xl p-4 shadow-sm">
            <RecipeType recipeId={recipeId} />
          </div>
        </div>
        <div className="flex-1 rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-text-title">
            {t("data:configuration.sections.recipes.ingredients")}
          </h3>
          <IngredientsList recipeId={recipeId} searchStr={searchStr} />
        </div>
      </div>
    </div>
  );
};
