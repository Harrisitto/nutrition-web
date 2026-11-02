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
import { RecipeDescription } from "./@components/description";
import { placeholderRecipeImg } from "../constants";

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
      <div className="flex flex-col gap-6 rounded-2xl border border-nutrition-green/20 bg-gradient-to-br from-white to-white-green/70 p-5 shadow-md sm:flex-row">
        <img
          src={recipe.url ?? placeholderRecipeImg}
          alt={recipe.name}
          className="aspect-square w-full shrink-0 self-start rounded-xl object-cover shadow-sm sm:w-64"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-nutrition-green/15 pb-3">
            <h2 className="text-2xl font-bold uppercase leading-tight text-text-title">
              {recipe.name}
            </h2>
            <div className="flex flex-col items-end">
              <span className="text-xs font-medium text-text-muted">
                {t("data:configuration.sections.recipes.rating")}
              </span>
              <div className="flex flex-row">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${i + 1}/5`}
                    onClick={() => updateRating((i + 1) * 20)}
                    className={`px-0.5 text-2xl leading-none transition-transform hover:scale-110 ${
                      i < recipeRating
                        ? "text-yellow-400"
                        : "text-nutrition-green/20 hover:text-yellow-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>
          <RecipeDescription description={recipe.description} />
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
