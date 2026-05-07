import { useState } from "react";
import { List } from "./list";
import { ViewRecipe } from "./recipe";
import { useFetchAllMealTypes } from "@src/services/tanstack/data/meals";
import { useTranslation } from "react-i18next";

export const Recipes = () => {
  const [searchStr, setSearchStr] = useState("");
  const [selectedType, setSelectedType] = useState(-1);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const { t } = useTranslation();
  const { data: types } = useFetchAllMealTypes();

  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-2">
        <input
          type="text"
          value={searchStr}
          onChange={(e) => setSearchStr(e.target.value)}
          placeholder="..."
          className="flex-1 rounded border px-3 py-2"
        />
        {types && (
          <select
            className="mt-2 flex-1 rounded border px-3 py-2 max-w-xs bg-white"
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
  );
};
