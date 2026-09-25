import { useState } from "react";
import { List } from "./@components/list";
import { ViewRecipe } from "./recipe";
import { useFetchAllMealTypes } from "@src/services/tanstack/data/meals";
import { useTranslation } from "react-i18next";
import { ConfigurationPages } from "@src/pages/configuration/@components/title";

export const Recipes = () => {
  const [searchStr, setSearchStr] = useState("");
  const [selectedType, setSelectedType] = useState(-1);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const { t } = useTranslation();
  const { data: types } = useFetchAllMealTypes();

  return (
    <ConfigurationPages
      title={t("data:configuration.sections.recipes.title")}
      description={t("data:configuration.sections.recipes.description")}
    >
      <div className="w-full max-w-5xl space-y-4 animate-fade-in">
        <div className="flex flex-col gap-2 rounded-2xl border border-nutrition-green/20 bg-gradient-to-br from-white to-white-green/70 p-4 shadow-md sm:flex-row">
          <input
            type="text"
            value={searchStr}
            onChange={(e) => setSearchStr(e.target.value)}
            placeholder="..."
            className="flex-1 rounded-lg border border-nutrition-green/20 bg-white px-3 py-2 text-sm text-dark-green outline-none transition-all placeholder:text-text-muted/80 focus:border-nutrition-green/50 focus:ring-2 focus:ring-light-green/40"
          />
          {types && (
            <select
              className="flex-1 rounded-lg border border-nutrition-green/20 bg-white px-3 py-2 text-sm text-dark-green outline-none transition-all max-w-xs focus:border-nutrition-green/50 focus:ring-2 focus:ring-light-green/40"
              defaultValue=""
              onChange={(e) => setSelectedType(Number(e.target.value))}
            >
              <option value={-1}>
                {t("data:configuration.sections.recipes.showAllTypes")}
              </option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedRecipeId ? (
          <div>
            <ViewRecipe
              searchStr={searchStr}
              recipeId={selectedRecipeId}
              goBack={() => {
                setSelectedRecipeId(null);
                setSearchStr("");
              }}
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <List
              typeId={selectedType !== -1 ? selectedType : undefined}
              searchStr={searchStr}
              onSelectRecipe={(id) => {
                setSelectedRecipeId(id);
                setSearchStr("");
              }}
            />
          </div>
        )}
      </div>
    </ConfigurationPages>
  );
};
