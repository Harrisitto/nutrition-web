import { useFetchRecipeInfo } from "@src/services/tanstack/data/recipes";
import { useUnitLabel } from "@src/services/tanstack/data/ingredients";
import { cardStyle } from "@src/components/styles";
import { ChefHat, ChevronLeft, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

// Ficha de una receta del catálogo, solo lectura (aún no hay API de escritura para los editores)
export const RecipeDetail = ({
  recipeId,
  goBack,
}: {
  recipeId: number;
  goBack: () => void;
}) => {
  const { t } = useTranslation();
  const { data: recipe, isLoading } = useFetchRecipeInfo({ recipeId });
  const unitLabel = useUnitLabel();

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

  const macros = [
    { label: "kcal", value: recipe.macros.kcal },
    { label: t("data:databaseEditors.recipes.prot"), value: recipe.macros.prot },
    { label: t("data:databaseEditors.recipes.hc"), value: recipe.macros.hc },
    { label: t("data:databaseEditors.recipes.fat"), value: recipe.macros.fat },
  ];

  return (
    <div className="w-full space-y-4 animate-fade-in">
      <button
        type="button"
        onClick={goBack}
        aria-label={t("data:databaseEditors.recipes.backToList")}
        className="inline-flex items-center gap-1 rounded-lg p-2 text-sm font-medium text-nutrition-green transition-colors hover:bg-white-green/60"
      >
        <ChevronLeft size={18} />
        {t("data:databaseEditors.recipes.backToList")}
      </button>

      <div className={`${cardStyle} flex flex-col gap-5 p-5 sm:flex-row`}>
        {recipe.url ? (
          <img
            src={recipe.url}
            alt={recipe.name ?? ""}
            className="aspect-square w-full shrink-0 self-start rounded-xl object-cover sm:w-56"
          />
        ) : (
          <div className="flex aspect-square w-full shrink-0 items-center justify-center self-start rounded-xl bg-white-green text-nutrition-green/50 sm:w-56">
            <ChefHat size={48} />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div>
            <p className="text-xs font-medium text-text-muted">
              {t("data:databaseEditors.recipes.id")} {recipe.id}
            </p>
            <h2 className="text-2xl font-bold leading-tight text-text-title">
              {recipe.name}
            </h2>
          </div>
          {recipe.description && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-text-body">
              {recipe.description}
            </p>
          )}
          <dl className="grid grid-cols-4 gap-2">
            {macros.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-lg border border-nutrition-green/15 bg-white px-3 py-2 text-center"
              >
                <dt className="text-xs text-text-muted">{label}</dt>
                <dd className="text-lg font-semibold tabular-nums text-dark-green">
                  {Math.round(value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className={`${cardStyle} p-5`}>
        <h3 className="mb-3 text-lg font-semibold text-text-title">
          {t("data:databaseEditors.recipes.ingredients")}
        </h3>
        <ul className="divide-y divide-nutrition-green/10">
          {recipe.ingredients.map(({ ingredient_id, ingredient, amount, unit_id, comment }) => (
            <li key={ingredient_id} className="flex items-baseline justify-between gap-4 py-2">
              <div className="min-w-0">
                <p className="font-medium text-text-title">{ingredient?.name}</p>
                {comment && <p className="text-xs italic text-text-muted">{comment}</p>}
              </div>
              <span className="shrink-0 text-sm font-medium tabular-nums text-nutrition-green">
                {amount} {unitLabel(unit_id)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
