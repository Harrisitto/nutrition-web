import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import { RecipesList } from "./@components/list";
import { RecipeDetail } from "./@components/detail";

// Página de los editores de la base de datos. ProtectedRoute (databaseEditorRequired) ya deja fuera al resto
const PageDatabaseEditors = () => {
  const { t } = useTranslation();
  const { navigateTo } = useAppNavigation();
  const [searchStr, setSearchStr] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">
      <button
        type="button"
        onClick={() => navigateTo(APP_ROUTES.DASHBOARD)}
        className="inline-flex items-center gap-1 rounded-lg p-2 text-sm font-medium text-nutrition-green transition-colors hover:bg-white-green/60"
      >
        <ChevronLeft size={18} />
        {t("data:databaseEditors.back")}
      </button>

      <header className="animate-fade-in border-l-4 border-nutrition-green pl-4">
        <h1 className="text-2xl font-bold text-text-title md:text-3xl">
          {t("data:databaseEditors.title")}
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-text-muted">
          {t("data:databaseEditors.description")}
        </p>
      </header>

      {selectedRecipeId !== null ? (
        <RecipeDetail
          recipeId={selectedRecipeId}
          goBack={() => setSelectedRecipeId(null)}
        />
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            value={searchStr}
            onChange={(e) => setSearchStr(e.target.value)}
            placeholder={t("data:databaseEditors.recipes.search")}
            className="w-full rounded-lg border border-nutrition-green/20 bg-white px-3 py-2 text-sm text-dark-green outline-none transition-all placeholder:text-text-muted/80 focus:border-nutrition-green/50 focus:ring-2 focus:ring-light-green/40"
          />
          <RecipesList searchStr={searchStr} onSelectRecipe={setSelectedRecipeId} />
        </div>
      )}
    </div>
  );
};

export default PageDatabaseEditors;
