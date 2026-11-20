import { useFetchRecipes } from "@src/services/tanstack/data/recipes";
import { ChefHat, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

// Recetas del catálogo en tabla compacta: id, nombre y macros con las cantidades de la receta
export const RecipesList = ({
  searchStr,
  onSelectRecipe,
}: {
  searchStr: string;
  onSelectRecipe: (id: number) => void;
}) => {
  const { t } = useTranslation();
  const { data: recipes, isLoading } = useFetchRecipes({ searchStr });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-nutrition-green">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!recipes?.length) {
    return (
      <p className="p-8 text-center text-sm text-text-muted">
        {t("data:databaseEditors.recipes.empty")}
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-nutrition-green/20 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-white-green/60 text-left text-xs font-semibold uppercase text-text-muted">
          <tr>
            <th className="px-3 py-2">{t("data:databaseEditors.recipes.id")}</th>
            <th className="px-3 py-2">{t("data:databaseEditors.recipes.name")}</th>
            <th className="px-3 py-2 text-right">kcal</th>
            <th className="px-3 py-2 text-right">{t("data:databaseEditors.recipes.prot")}</th>
            <th className="px-3 py-2 text-right">{t("data:databaseEditors.recipes.hc")}</th>
            <th className="px-3 py-2 text-right">{t("data:databaseEditors.recipes.fat")}</th>
          </tr>
        </thead>
        <tbody>
          {recipes
            .slice()
            .sort((a, b) => a.id - b.id)
            .map((recipe) => (
              <tr
                key={recipe.id}
                onClick={() => onSelectRecipe(recipe.id)}
                className="cursor-pointer border-t border-nutrition-green/10 transition-colors hover:bg-white-green/50"
              >
                <td className="px-3 py-2 tabular-nums text-text-muted">{recipe.id}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    {recipe.url ? (
                      <img
                        src={recipe.url}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white-green text-nutrition-green/60">
                        <ChefHat size={18} />
                      </span>
                    )}
                    <span className="font-medium text-text-title">{recipe.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{Math.round(recipe.macros.kcal)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{Math.round(recipe.macros.prot)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{Math.round(recipe.macros.hc)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{Math.round(recipe.macros.fat)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
