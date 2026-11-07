import { useTranslation } from "react-i18next";
import { CustomRecipesManager } from "@src/components/shared/recipes/manager";
import { ConfigurationPages } from "@src/pages/configuration/@components/title";
import { useFetchMyCustomRecipes } from "@src/services/tanstack/user/customRecipes";

// El formulario es compartido: el dashboard lo usa para las recetas del cliente
const PageNutritionistRecipes = () => {
  const { t } = useTranslation();
  const query = useFetchMyCustomRecipes();

  return (
    <ConfigurationPages
      title={t("data:configuration.sections.myRecipes.title")}
      description={t("data:configuration.sections.myRecipes.description")}
    >
      <CustomRecipesManager query={query} />
    </ConfigurationPages>
  );
};

export default PageNutritionistRecipes;
