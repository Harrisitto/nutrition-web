import { useTranslation } from "react-i18next";
import { CustomRecipesManager } from "@src/components/shared/recipes/manager";
import { useFetchClientAndMyCustomRecipes } from "@src/services/tanstack/user/customRecipes";

// Recetas propias del cliente seleccionado y del nutricionista. Las nuevas se guardan con el cliente
// como dueño; al editar una, el dueño no cambia
const PageClientRecipes = () => {
  const { t } = useTranslation();
  const query = useFetchClientAndMyCustomRecipes();

  return (
    <div className="m-4 space-y-6">
      <header className="animate-fade-in border-l-4 border-nutrition-green pl-4">
        <h1 className="text-2xl font-bold text-text-title md:text-3xl">
          {t("data:customRecipes.client.title")}
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-text-muted">
          {t("data:customRecipes.client.description")}
        </p>
      </header>
      <div className="flex flex-col items-center">
        <CustomRecipesManager query={query} toClient showOwner />
      </div>
    </div>
  );
};

export default PageClientRecipes;
